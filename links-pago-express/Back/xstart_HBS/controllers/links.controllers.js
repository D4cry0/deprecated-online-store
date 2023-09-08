import { response, request } from 'express';

import { ConektaApi } from '../models/conekta.js';

import { decryptAESURL } from '../helpers/utils.js';

import { QuerySQL } from '../models/mysqldb.js';

const coapi = new ConektaApi();
const qSql = new QuerySQL();

const linkGet = (req, res = response) => {
    res.status(503).json({ msg: 'Not available' });
}

const linkPost = async (req = request, res = response) => {
    const { orderid, customer, customerid, email, phone, amount } = req.body;

    // Si orderid ya existe no hacer nada
    if (await qSql.isFieldExist('order', orderid)) {
        return res.status(200).end();
    }

    let io = req.app.get('socketio');

    console.log({
        msg: 'Compra recibida',
        orderid: orderid,
        customer: customer,
        customerid: customerid,
        email: email,
        phone: phone,
        amount: amount,
    });

    // Obtengo el link de Conekta con los datos que se capturaron
    const clink = await coapi.createLink(orderid, customer, email, phone, amount);

    if (!clink.id) {
        // TODO: hacer otra cosa cuando falle
        // TODO: LOGS ARCHIVOS
        console.log(clink);

        // Ciclo de 6 intentos de 30 segundos
        /* 
            Al fallar los 6 ciclos debe de guardala en DB y con error para que el vendedor
            pueda intentar generarlos manualmente (con boton) o contacte al administrador
            para revisar logs
        */

        return res.status(504).json({ msg: 'LINK' });
    }

    // TODO: Mercado Pago Link similar a clink



    console.log('Link de pago: ', clink);

    try {
        // TODO: ID_USR
        let sqlStatus = await qSql.insertNewData(orderid, customer, clink.url, clink.id, 'no-url', req.uAuth.ID_USR);

        console.log('SQL Status: ', sqlStatus);
        // TODO: Implementar un reload por componente en vez de por pagina
        io.emit('new-record', true);

    } catch (error) {
        // TODO: Mostrar alerta error en el servidor en el panel del vendedor
        // TODO: LOGS ARCHIVOS
        console.log(error);
        return res.status(500).json({ msg: 'FAIL' })
    }

    res.status(200).send(process.env.HOST + '/checkout/' + orderid);
}

const linkPut = (req, res = response) => {
    res.status(503).json({ msg: 'Not available' });
}

const linkPatch = (req, res = response) => {
    res.status(503).json({ msg: 'Not available' });
}

const linkDelete = (req, res = response) => {
    res.status(503).json({ msg: 'Not available' });
}

// TODO: Validar que Conekta sea quien envia la información
const linkConektaHook = async (req = request, res = response) => {

    /* 
    data: {
        object: {
            livemode: false,
            amount: 150000,
            currency: 'MXN',
            payment_status: 'paid',
            amount_refunded: 0,
            customer_info: [Object],
            channel: [Object],
            object: 'order',
        ->>id: 'ord_2tBfapRB6chg2vnvp',
            metadata: {},
            created_at: 1673627167,
            updated_at: 1673627198,
        ->>line_items: [Object],
            shipping_lines: [Object],
            charges: [Object]
        },
        previous_attributes: {}
    },

    Probable name en line items
    */


    if (req.body.type === 'order.paid') {

        try {
            let io = req.app.get('socketio');

            console.log("BODY", req.body);
            console.log("HEADERS", req.headers);
            console.log("PARA SERVER ConektaOrder: ",
                req.body.data.object.id,
                "OrderId: ",
                req.body.data.object.line_items.data[0].name);

            const orderid = req.body.data.object.line_items.data[0].name;

            // TODO: Mandar mensajes o alertar de alguna manera de que se pago una orden que se cancelo
            // No importa la razon, del porque se cancelo pero que si se pago.
            // TODO: Guardar en DB created_at = fecha de pago en UNIX
            console.log(req.body.created_at);

            const sqlStatus = await qSql.updateStatus(orderid, "paid", true);

            console.log('SQL Status: ', sqlStatus);

            // TODO: Implementar un reload por componente en vez de por pagina
            io.emit('new-record', true);

            res.status(200).json({ msg: 'OK' });
        } catch (error) {
            // TODO: LOGS ARCHIVOS
            console.log(error);

            res.status(200).json({ msg: 'STATUS F' });
        }

    }

    res.status(200).end();
}

const linkPatchUpdateOrder = async (req = request, res = response) => {

    // TODO: VALIDAR QUE ORDEN EXISTA PARA EVITAR THROW ERRORS
    // TODO: VALIDAD QUE TENGA LINKS DE PAGO PARA EVITAR THROW ERRORS

    try {

        // action
        // update => modificar
        // cancel => cancelar
        let { id_so, action } = req.params;
        console.log('Param id_so: ', id_so);
        console.log('Param action:', action);
        console.log('uAuth:', req.uAuth);

        if (req.uAuth.ID_SYSR != 5 && req.uAuth.ID_SYSR != 10 && req.uAuth.ID_SYSR != 1) {
            return res.status(403).json({ msg: 'STATUS E100 contacte al administrador' })
        }

        id_so = parseInt(decryptAESURL(id_so));
        console.log(id_so);

        let io = req.app.get('socketio');

        const data = await qSql.getPaymentInfo(id_so);
        console.log(data);
        // Is all status are not P return true
        const isNotPaid = data.every(item => {
            return item.SOPAYS_STATUS !== 'P';
        });

        if (!isNotPaid) {
            if (action === 'cancel') return res.status(403).json({ msg: 'STATUS E101' })

            const { WHM_STATUS } = qSql.getShippingInfo(id_so);
            if (WHM_STATUS !== 'P' && WHM_STATUS !== 'R') return res.status(403).json({ msg: 'STATUS E102' });
        }

        const sqlStatus = await qSql.updateStatus(id_so, 'SALES_ORDERS_SO',
            'SO_STATUS', action === 'update' ? 'MOD' : 'CAN');
        console.log('SQL Status: ', sqlStatus);

        data.forEach(async (item) => {
            if (item.SOPAYS_STATUS === 'A') {
                console.log(item);

                let resp = null;
                switch (item.ID_PAYS) {
                    // Mercado pago
                    case 2: resp = true;
                        console.log('Mercado Pago cancelado: ', resp);
                        break;
                    // Conekta
                    case 3: resp = await coapi.cancelLink(item.SOPAYS_INTERNAL_ID);
                        console.log('Conekta cancelado: ', resp);
                        break;

                }

                if (resp === true) {
                    const sqlStatus = await qSql.updateStatus(id_so, 'SO_HAS_PAYLINKS', 'SOPAYS_STATUS', 'C', true, 'ID_SOPAYS', item.ID_SOPAYS);
                    console.log('SQL Status: ', sqlStatus);
                }
            }
        });

        // TODO: Alertar en el panel de vendedor que el enlace de Conekta o MP
        // no se cancelo para que avise a ADMIN lanzar Throwsss

        // TODO: Implementar un reload por componente en vez de por pagina
        io.emit('new-record', true);

        res.status(200).json({ msg: 'OK' });
    } catch (error) {
        // TODO: Asginar alertas en el panel del vendedor para avisar al admin
        // TODO: LOGS ARCHIVOS
        console.log(error);

        res.status(200).json({ msg: 'STATUS F' });
    }
}

const linkPatchUpdateShipping = async (req = request, res = response) => {

    try {
        let { id_so, action } = req.params;
        console.log('Param id_so: ', id_so);
        console.log('Param action:', action);
        console.log('uAuth:', req.uAuth);

        if (req.uAuth.ID_SYSR != 9 && req.uAuth.ID_SYSR != 11) {
            return res.status(403).json({ msg: 'STATUS E100 contacte al administrador' })
        }

        id_so = parseInt(decryptAESURL(id_so));
        console.log(id_so);

        let io = req.app.get('socketio');

        if (action == 'cancel') {
            const sqlStatus = await qSql.updateStatus(id_so, 'SO_TRACKINGS_SOTR', 'SOTR_MASTER', null);
            console.log('SQL Status: ', sqlStatus);
        }

        io.emit('new-record', true);

        res.status(200).json({ msg: 'OK' });
    } catch (error) {
        // TODO: Asginar alertas en el panel del vendedor para avisar al admin
        // TODO: LOGS ARCHIVOS
        console.log(error);

        res.status(200).json({ msg: 'STATUS F' });
    }
}

export {
    linkGet,
    linkPost,
    linkPut,
    linkDelete,
    linkConektaHook,
    linkPatchUpdateOrder,
    linkPatchUpdateShipping
}