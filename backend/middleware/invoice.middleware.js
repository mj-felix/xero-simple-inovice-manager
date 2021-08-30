import asyncHandler from 'express-async-handler';

import errors from '../messages/error.messages.js';
import Invoice from '../models/invoice.model.js';

const checkInvoiceExists = asyncHandler(async (req, res, next) => {
    const { invoiceId } = req.params;
    const invoiceIds = invoiceId.split(',');
    let existingInvoice;

    for (let invoiceId of invoiceIds) {
        console.log(invoiceId);
        existingInvoice = await Invoice.findOne(invoiceId);
        if (!existingInvoice) {
            res.status(404);
            throw new Error(errors.invoice.NOT_FOUND);
        }
    }

    if (invoiceIds.length > 1) req.invoiceIds = invoiceIds;
    else {
        req.invoice = existingInvoice;
    }
    next();
});

export { checkInvoiceExists };