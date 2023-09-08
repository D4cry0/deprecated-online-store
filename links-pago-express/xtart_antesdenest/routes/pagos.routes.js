import { Router } from 'express';

import { permLink } from '../controllers/pagos.controllers.js';

const pagosRouter = Router();

pagosRouter.get('/:id', permLink);

export {
    pagosRouter
}