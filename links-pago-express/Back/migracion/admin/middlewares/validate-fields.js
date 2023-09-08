import { validationResult } from 'express-validator';

// deben de ir con req y res
// next es lo que se llama si esto pasa bien
// es para pasar entre middlewares
const validateFields = (req, res, next) => {

    // Enlistamos los errores que generaron los middlewares en las rutas
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
}

const validateOrderActions = (req, res, next) => {
    const { action } = req.params;

    switch (action) {
        case 'update': next();
        case 'cancel': next();
        default:
            return res.status(403).json({
                msg: 'Accion no valida'
            });
    }
}

const validateShippingActions = (req, res, next) => {
    const { action } = req.params;

    switch (action) {
        case 'update': next();
        case 'cancel': next();
        default:
            return res.status(403).json({
                msg: 'Accion no valida'
            });
    }
}

export {
    validateFields,
    validateOrderActions,
    validateShippingActions
}