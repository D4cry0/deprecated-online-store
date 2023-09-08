import { response, request } from 'express';
import * as fs from 'fs';

import jwt from "jsonwebtoken";

import { QuerySQL } from '../models/mysqldb.js';
import { genJWT } from '../helpers/gen-jwt.js';

const qSql = new QuerySQL();

// TODO: ORDENAR LOS PEDIDOS POR ESTATUS DE ENVIO(PAGADAS Y PENDIENTES DE SURTIR), FECHA DE PAGO Y ULTIMA MODIFICACION
const ordenes = async (req, res = response) => {

    try {
        const tpsupp = await qSql.getAllParcelSuppliers();

        const tLinks = await qSql.getTotalLinks('E');
        const data = await qSql.getPermLinks('E', (tLinks - 20 < 0) ? 0 : (tLinks - 20), 20);
        const dataPlinks = await qSql.getLinksByPermlink('E', (tLinks - 20 < 0) ? 0 : (tLinks - 20), 20);

        const payload = data.map(item => {
            item.paylinksStatus = '';
            item.actions = [];

            dataPlinks.forEach(link => {
                if (link.ID_SO === item.ID_SO) item.paylinksStatus += link.SOPAYS_STATUS + ',';
            });

            item.paylinksStatus = item.paylinksStatus.slice(0, -1);

            if (item.paylinksStatus.match(/[AP]/g) && item.WHM_STATUS_inull !== 'V') item.actions.push('MODIFICAR');
            if (!item.paylinksStatus.match(/[P]/g) && item.SO_STATUS !== 'CAN') item.actions.push('CANCELAR');
            // if (item.paylinksStatus.match(/[P]/g)) item.actions.push('DEVOLUCION');

            if (item.actions.length < 1) item.actions = null;

            return item;
        })

        console.log('SQLQpayload:', payload);

        res.render('orders', {
            pagina: ' Ventas Rápidas',
            titulo: 'Portal de Ventas Rápidas ',
            dblinks: payload,
            dbpsupp: tpsupp.map(item => item.PARS_NAME).toString(),
            host: process.env.HOST + '/checkout/',
            ordtotal: tLinks,
            uAuthName: req.uAuth.USR_LOGIN_NAME,
            uAuthSysR: req.uAuth.ID_SYSR
        });
    } catch (error) {
        // TODO: LOGS ARCHIVOS
        console.log(error);
        res.render('404', {
            pagina: ' Portal de Pago',
            titulo: '500 - Servicio no disponible'
        });
    }

}

const login = async (req, res = response) => {

    // 100 - User and password incorrect
    // 200 - Contact admin
    // 300 - Restart login

    const { el } = req.query;
    if (el) {
        return res.status(401).render('login', {
            pagina: ' Ventas Rápidas - Login',
            titulo: 'Login',
            msg: el === '100'
                ? 'Usuario y/o contraseña incorrectos'
                : el === '200' ? 'Contacte con el administrador'
                    : 'Reinicie su sesión de usuario'
        });
    }


    try {
        // Check if there is an active user sesion
        const token = req.cookies['uauth'];

        if (!token)
            throw new Error('OK LOGIN CONTINUE, NEW JWT');

        const publicKey = fs.readFileSync('./ssl/p.pem', 'utf8');

        // Check the sesion
        const { uid } = jwt.verify(token, publicKey, { issuer: 'soft', algorithm: ["RS256"] });

        const uAuth = await qSql.getUAuth(uid);

        if (!uAuth) {
            return res.status(401).json({
                msg: 'Usuario y/o contraseña incorrectos'
            });
        }

        if (uAuth.USR_STATUS !== 'ACTIVE') {
            return res.status(401).json({
                msg: 'Contacte con el administrador'
            });
        }


        if (req.method === 'GET') {
            return res.status(200).redirect('/xstar/ordenes');
        }

        return res.status(200).json({
            msg: 'OK'
        });

    } catch (error) {
        // TODO: LOGS ARCHIVOS
        console.log(error);
    }

    console.log('NEW JWT');

    try {
        const { user = '', wrd = '' } = req.body;
        const uAuth = await qSql.getLogin(user, wrd);

        if (!uAuth) {
            return res.status(401).json({
                msg: 'Usuario y/o contraseña incorrectos'
            });
        }

        if (uAuth.USR_STATUS !== 'ACTIVE') {
            return res.status(401).json({
                msg: 'Contacte con el administrador'
            });
        }

        const token = await genJWT(uAuth.ID_USR);
        res.cookie('uauth', token, {
            maxAge: 43200 * 1000, // 12 hours
            httpOnly: true, // http only, prevents JavaScript cookie access
            secure: true // cookie must be sent over https / ssl
        });

        if (req.method === 'GET') {
            return res.status(200).redirect('/xstar/ordenes');
        }

        return res.status(200).json({
            msg: 'OK'
        });

    } catch (error) {
        // TODO: LOGS ARCHIVOS
        console.log(error);
        return res.status(500).json({
            msg: 'Contacte con el administrador',
        });
    }
}

export {
    ordenes,
    login,
}