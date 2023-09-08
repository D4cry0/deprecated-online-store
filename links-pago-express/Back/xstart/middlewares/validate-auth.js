import { request, response } from 'express';
import * as fs from 'fs';

import jwt from "jsonwebtoken";

import { QuerySQL } from '../models/mysqldb.js'

const qSql = new QuerySQL();

const authCookie = async (token) => {
    const publicKey = fs.readFileSync('./ssl/p.pem', 'utf8');

    // Desestructuramos para obtener el UID
    const { uid } = jwt.verify(token, publicKey, { issuer: 'soft', algorithm: ["RS256"] });

    const uAuth = await qSql.getUAuth(uid);

    return uAuth;
}

const validateAuthHeader = async (req = request, res = response, next) => {

    const authh = req.headers.authorization;
    const token = req.cookies['uauth'];
    let uAuth = null;

    if (token) {
        uAuth = await authCookie(token);

        if (!uAuth) {
            return res.status(401).json({
                msg: 'Credenciales no validas',
            });
        }

        if (uAuth.USR_STATUS !== 'ACTIVE') {
            return res.status(401).json({
                msg: 'Sin autorización, contacte al administrador',
            });
        }
    } else {
        if (!authh) {
            return res.status(401).json({
                msg: 'Sin autorización, contacte al administrador',
            });
        }

        const auth = new Buffer.from(authh.split(' ')[1],
            'base64').toString().split(':');

        uAuth = await qSql.getLogin(auth[0], auth[1]);

        if (!uAuth) {
            return res.status(401).json({
                msg: 'Usuario y/o contraseña incorrectos',
            });
        }

        if (uAuth.USR_STATUS !== 'ACTIVE') {
            return res.status(401).json({
                msg: 'Sin autorización, contacte al administrador',
            });
        }
    }

    req.uAuth = uAuth;

    next();
}

const validateAuthCookie = async (req = request, res = response, next) => {

    try {
        const token = req.cookies['uauth'];

        if (!token) {
            return res.status(401).redirect('/xstar/ordenes/login?el=300');
        }

        const uAuth = await authCookie(token);

        if (!uAuth) {
            return res.status(401).redirect('/xstar/ordenes/login?el=100');
        }

        if (uAuth.USR_STATUS !== 'ACTIVE') {
            return res.status(401).redirect('/xstar/ordenes/login?el=200');
        }

        req.uAuth = uAuth;

        next();
    } catch (err) {
        // TODO: LOGS ARCHIVOS
        console.log(err);
        return res.status(401).redirect('/xstar/ordenes/login?el=300');
    }
}

export {
    validateAuthHeader,
    validateAuthCookie
}