import asyncHandler from 'express-async-handler';

import errors from '../messages/error.messages.js';
import Invoice from '../models/invoice.model.js';

const checkInvoiceExists = asyncHandler(async (req, res, next) => {
    const { invoiceId } = req.params;
    const invoiceIds = invoiceId.split(',');
    let existingInvoice;

    for (let invoiceId of invoiceIds) {
        existingInvoice = await Invoice.findOne(invoiceId);
        if (!existingInvoice) {
            res.status(404);
            throw new Error(errors.invoice.NOT_FOUND);
        }
    }

    if (invoiceIds.length > 1) {
        req.invoiceIds = invoiceIds;
        const { overwrite } = req.query;
        if (overwrite) {
            req.overwrite = overwrite;
        }
    }
    else {
        req.invoice = existingInvoice;
    }
    next();
});

export { checkInvoiceExists };