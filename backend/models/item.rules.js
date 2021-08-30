import { body } from 'express-validator';

import errors from '../messages/error.messages.js';

export default [
    body('price', errors.item.PRICE_POSITIVE_NUMBER).isFloat({ gt: 0 }),
    body('quantity', errors.item.QUANTITY_POSITIVE_INTEGER).isInt({ gt: 0 }),
    body('description', errors.item.DESC_REQUIRED).trim().notEmpty(),
];