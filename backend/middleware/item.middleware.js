import asyncHandler from 'express-async-handler';

import errors from '../messages/error.messages.js';

const checkItemExists = asyncHandler(async (req, res, next) => {
    const existingInvoice = req.invoice;
    const { itemId } = req.params;

    const existingItems = existingInvoice.items.filter((item) => (item.uuid === itemId));

    if (existingItems.length === 0) {
        res.status(404);
        throw new Error(errors.item.NOT_FOUND);
    }
    next();
});

export { checkItemExists };