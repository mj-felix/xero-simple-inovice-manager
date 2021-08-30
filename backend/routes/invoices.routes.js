import express from 'express';

import invoiceController from '../controllers/invoice.controller.js';

const router = express.Router();

router.route('/')
    .get(invoiceController.fetchInvoices)
    .post(invoiceController.createInvoice);

router.route('/:invoiceId')
    .get(invoiceController.fetchInvoice)
    .post(invoiceController.cloneInvoice)
    .put(invoiceController.updateInvoice)
    .delete(invoiceController.deleteInvoice);

export default router;