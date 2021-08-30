import express from 'express';

import invoiceController from '../controllers/invoice.controller.js';
import { checkInvoiceExists } from '../middleware/invoice.middleware.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *
 *   requestBodies:
 *     InvoiceBody:
 *       type: object
 *       example:
 *         invoiceDate: 2021-12-31
 *         invoiceNumber: INV007
 *         items:
 *              - price: 10.21
 *                quantity: 6
 *                description: Apples
 *              - price: 6.21
 *                quantity: 36
 *                description: Pears
 */

/**
 * @openapi
 * tags:
 *   name: Invoices
 *   description: API for managing invoices
 */

router.route('/')
    .get(invoiceController.fetchInvoices)

    /**
     * @openapi
     * /api/v1/invoices:
     *   post:
     *     summary: Creates new invoice
     *     tags: [Invoices]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *             schema:
     *               $ref: '#/components/requestBodies/InvoiceBody'
     *     responses:
     *       201:
     *         description: Invoice created
     */
    .post(invoiceController.createInvoice);

router.route('/:invoiceId')
    .get(checkInvoiceExists, invoiceController.fetchInvoice)
    .post(checkInvoiceExists, invoiceController.cloneOrMergeInvoices)
    .put(checkInvoiceExists, invoiceController.updateInvoice)
    .delete(checkInvoiceExists, invoiceController.deleteInvoice);

export default router;