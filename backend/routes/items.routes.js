import express from 'express';

import itemsController from '../controllers/item.controller.js';
import { checkItemExists } from '../middleware/item.middleware.js';
import validate from '../middleware/validate.middleware.js';
import itemRules from '../models/item.rules.js';

const router = express.Router({ mergeParams: true });

/**
 * @openapi
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated id of the invoice item
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           exclusiveMinimum: true
 *           description: Price of the invoice item
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the invoice item
 *         description:
 *           type: string
 *           description: Description of the invoice item
 *       example:
 *         id: bc010eee-d584-4feb-b08b-77d5acf2c54a
 *         price: 10.21
 *         quantity: 32
 *         description: Oranges
 *
 *   requestBodies:
 *     ItemBody:
 *       type: object
 *       required:
 *         - price
 *         - quantity
 *         - description
 *       properties:
 *         price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           exclusiveMinimum: true
 *           description: Price of the invoice item
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the invoice item
 *         description:
 *           type: string
 *           description: Description of the invoice item
 *       example:
 *         price: 10.21
 *         quantity: 32
 *         description: Oranges
 *
 */

/**
 * @openapi
 * tags:
 *   name: Items
 *   description: API for managing invoice items
 */


/**
 * @openapi
 * /api/v1/invoices/{invoiceId}/items:
 *   post:
 *     summary: Creates new item for the invoice with invoiceId
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Invoice id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/requestBodies/ItemBody'
 *     responses:
 *       200:
 *         description: Item created, returns whole invoice
 *       404:
 *         description: Invoice not found
 *         content:
 *           application/json:
 *             example:
 *                  message: Invoice not found
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *                  errors:
 *                      - price: Price must be a positive number
 *                      - quantity: Quantity must be a positive integer
 *                      - description: Description must be provided
 */
router.route('/')
    .post(validate(itemRules), itemsController.createItem);


/**
 * @openapi
 * /api/v1/invoices/{invoiceId}/items/{itemId}:
 *   delete:
 *     summary: Removes item by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: invoiceId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Invoice id
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: Item id
 *     responses:
 *       204:
 *         description: Item deleted, returns whole invoice
 *       404:
 *         description: Invoice not found | Item not found
 *         content:
 *           application/json:
 *             example:
 *                  message: Invoice not found
 */
router.route('/:itemId')
    .delete(checkItemExists, itemsController.deleteItem);

export default router;