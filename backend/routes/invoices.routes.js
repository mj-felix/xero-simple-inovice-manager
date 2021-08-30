import express from 'express';

import invoiceController from '../controllers/invoice.controller.js';
import { checkInvoiceExists } from '../middleware/invoice.middleware.js';

const router = express.Router();

router.route('/')
    .get(invoiceController.fetchInvoices)
    .post(invoiceController.createInvoice);

router.route('/:invoiceId')
    .get(checkInvoiceExists, invoiceController.fetchInvoice)
    .post(checkInvoiceExists, invoiceController.cloneInvoice)
    .put(checkInvoiceExists, invoiceController.updateInvoice)
    .delete(checkInvoiceExists, invoiceController.deleteInvoice);

export default router;