
import { Router } from 'express';
import { check } from 'express-validator';

import {
    linkDelete,
    linkGet,
    linkPatchUpdateOrder,
    linkPatchUpdateShipping,
    linkPost,
    linkPut,
    linkConektaHook
} from '../controllers/links.controllers.js';

import { validateFields, validateOrderActions, validateShippingActions } from '../middlewares/validate-fields.js';
import { validateAuthHeader } from '../middlewares/validate-auth.js';

const apiRouter = Router();

// TODO: APLICAR WORKERS PARA EVITAR BLOQUEOS
// TODO: MIDDLEWARE PARA VALIDAR QUE EL USUARIO TENGA X ROL PARA EJECUTAR X ACCION

apiRouter.get('/', linkGet);

apiRouter.post('/', [
    validateAuthHeader,
    check('orderid', 'Order ID is required').not().isEmpty(),
    check('orderid').customSanitizer((orderid) => {
        // return orderid.replace(/\D/g, '');
        if (/ECO-[a-zA-Z0-9]*-[a-zA-Z0-9]*/g.test(orderid))
            return orderid;

        // TODO: Implementar manejo del error
        return orderid + "-e";
    }),
    check('customer', 'Customer name is required').not().isEmpty(),
    check('customer').isAlpha('es-ES', { ignore: ' ' }),
    check('customerid', 'Customer ID is required').not().isEmpty(),
    check('email', 'Email is required and needs to be valid').isEmail(),
    check('phone').customSanitizer((phone) => {
        if (!phone || phone.length < 9)
            return '0000000000';

        phone = phone.replace(/\D/g, '');
        return phone.length > 9
            ? phone.substring(phone.length - 10, phone.length)
            : '0000000000';
    }),
    check('amount', 'Order total is required').not().isEmpty(),
    check('amount').customSanitizer((amount) => {
        amount = amount.replace(/[^0-9.\-]/g, '');
        return parseFloat(amount).toFixed(2);
    }),
    validateFields
], linkPost);

apiRouter.post('/conekta-hook', [
    validateFields
], linkConektaHook);

apiRouter.patch('/order/:id_so/:action', [
    validateAuthHeader,
    validateOrderActions,
    validateFields
], linkPatchUpdateOrder);

apiRouter.patch('/shipping/:id_so/:action', [
    validateAuthHeader,
    validateShippingActions,
    validateFields
], linkPatchUpdateShipping);

// apiRouter.post('/cancel', [
//     validateAuthHeader,
//     check('orderid', 'Order ID is required').not().isEmpty(),
//     check('orderid').customSanitizer((orderid) => {
//         return orderid.replace(/\D/g, '');
//     }),
//     validateFields
// ], linkCanceledOrder);


apiRouter.put('/', linkPut);

apiRouter.delete('/', linkDelete);

export {
    apiRouter
}