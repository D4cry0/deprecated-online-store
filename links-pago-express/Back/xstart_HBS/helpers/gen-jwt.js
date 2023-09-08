import { spawn } from 'child_process';
import * as fs from 'fs';

import jwt from "jsonwebtoken";

// Solo funciona con promesas
const genJWT = (uid = '') => {
    return new Promise((res, rej) => {

        const payload = { uid };

        const privateKey = fs.readFileSync('./ssl/p.pem', 'utf8');

        jwt.sign(payload, privateKey, {
            issuer: 'soft',
            expiresIn: '12h',
            algorithm: 'RS256',
        }, (err, token) => {

            if (err) {
                console.log(err);
                rej('No se pudo generar el token');
            } else {
                res(token);
            }

        });
    });
}

export {
    genJWT
}