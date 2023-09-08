
import { Router } from 'express';
import { check } from 'express-validator';

import { ordenes, login } from '../controllers/html.controllers.js';

import { validateFields } from '../middlewares/validate-fields.js';
import { validateAuthCookie } from '../middlewares/validate-auth.js';

const htmlRouter = Router();

// TODO: APLICAR WORKERS PARA EVITAR BLOQUEOS
// TODO: APLICAR LOGOUT para revocar la cookie

htmlRouter.get('/', [
    validateAuthCookie,
    validateFields
], ordenes);

htmlRouter.get('/login', login);

htmlRouter.post('/login', [
    check('user', 'User ID is required').not().isEmpty(),
    check('wrd', 'Password is required').not().isEmpty(),
    validateFields
], login);

htmlRouter.get('*', login);

export {
    htmlRouter
}