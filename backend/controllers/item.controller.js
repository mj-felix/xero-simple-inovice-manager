import asyncHandler from 'express-async-handler';

import Item from '../models/item.model.js';
import Invoice from '../models/invoice.model.js';

const createItem = asyncHandler(async (req, res) => {
    const existingInvoice = req.invoice;
    const { price, quantity, description } = req.body;
    const updatedInvoice = await existingInvoice.addItem(new Item(price, quantity, description));
    res.json(updatedInvoice);
});

const deleteItem = asyncHandler(async (req, res) => {
    const existingInvoice = req.invoice;
    const { itemId } = req.params;
    const updatedInvoice = await existingInvoice.removeItem(itemId);
    res.json(updatedInvoice);
});

export default { createItem, deleteItem };