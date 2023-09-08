import { response, request } from 'express';

import { QuerySQL } from '../models/mysqldb.js';

import { decryptAESURL } from '../helpers/utils.js';

const qSql = new QuerySQL();

const permLink = async (req, res = response) => {

    try {
        let amountPay = null;
        const { id } = req.params;

        let data = await qSql.getPaymentInfo(parseInt(decryptAESURL(id)));
        // TODO: QUE HACER CUANDO SE DETECTE QUE HAY LINKS ACTIVOS POR ERROR

        data = data.filter(item => {
            if (item.SOPAYS_STATUS === 'P') amountPay = (amountPay ? amountPay : 0) + parseFloat(item.SOPAYS_AMOUNT);
            if (item.SOPAYS_STATUS === 'A') return item
        });

        console.log(data);
        console.log(amountPay);

        res.status(200).render('perm-link', {
            pagina: ' Portal de Pago',
            titulo: 'Metodos de Pago',
            isHasPaylinks: data.length > 0,
            paylinks: data,
            amountPay: amountPay
        });
    } catch (error) {
        // TODO: LOGS ARCHIVOS
        console.log(error);
        res.status(404).render('404', {
            pagina: ' Portal de Pago',
            titulo: '404 - Link no válido contacte a '
        });
    }
}

export {
    permLink
}