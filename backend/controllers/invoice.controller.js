import asyncHandler from 'express-async-handler';

import Invoice from '../models/invoice.model.js';

const fetchInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.findAll();
    res.json(invoices);
});

const createInvoice = asyncHandler(async (req, res) => {
    const { invoiceDate, invoiceNumber, items } = req.body;
    const newInvoice = new Invoice(invoiceDate, invoiceNumber, items);
    const createdInvoice = await newInvoice.save();
    res.status(201).json(createdInvoice);
});

const fetchInvoice = asyncHandler(async (req, res) => {
    const { invoiceId } = req.params;
    const fetchedInvoice = await Invoice.findOne(invoiceId);
    res.json(fetchedInvoice);
});

const cloneOrMergeInvoices = asyncHandler(async (req, res) => {
    if (req.invoiceIds) {
        const mergedInvoice = await Invoice.merge(req.invoiceIds);
        res.status(201).json(mergedInvoice);
    } else {
        const { invoiceId } = req.params;
        const newInvoice = await Invoice.clone(invoiceId);
        res.status(201).json(newInvoice);
    }
});

const updateInvoice = asyncHandler(async (req, res) => {
    const { invoiceId } = req.params;
    const invoiceToUpdate = await Invoice.findOne(invoiceId);
    const { invoiceDate, invoiceNumber, items } = req.body;
    invoiceToUpdate.invoiceDate = invoiceDate;
    invoiceToUpdate.invoiceNumber = invoiceNumber;
    invoiceToUpdate.items = items;
    const updatedInvoice = await invoiceToUpdate.save();
    res.json(updatedInvoice);
});

const deleteInvoice = asyncHandler(async (req, res) => {
    const { invoiceId } = req.params;
    await Invoice.destroy(invoiceId);
    res.status(204).send();
});

export default { fetchInvoices, createInvoice, fetchInvoice, cloneOrMergeInvoices, updateInvoice, deleteInvoice };