import asyncHandler from 'express-async-handler';

import errors from '../messages/error.messages.js';
import Invoice from '../models/invoice.model.js';

const checkInvoiceExists = asyncHandler(async (req, res, next) => {
    const { invoiceId } = req.params;
    const existingInvoice = await Invoice.findOne(invoiceId);
    if (!existingInvoice) {
        res.status(404);
        throw new Error(errors.invoice.NOT_FOUND);
    }
    next();
});

export { checkInvoiceExists };