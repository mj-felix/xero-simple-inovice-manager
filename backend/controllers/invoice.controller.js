import asyncHandler from 'express-async-handler';

import Invoice from '../models/invoice.model.js';

const fetchInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.findAll();
    res.json(invoices);
});

const createInvoice = asyncHandler(async (req, res) => {
    const { invoiceDate, invoiceNumber, items } = req.body;
    const newInvoice = new Invoice(invoiceDate, invoiceNumber, items);
    await newInvoice.save();
    res.status(201).json(newInvoice);
});

const fetchInvoice = asyncHandler(async (req, res) => {
    const { invoiceId } = req.params;
    const fetchedInvoice = await Invoice.findOne(invoiceId);
    console.log(fetchedInvoice);
    res.json(fetchedInvoice);
});

const cloneInvoice = asyncHandler(async (req, res) => {
    const { invoiceId } = req.params;
    const existingInvoice = await Invoice.findOne(invoiceId);
    const newInvoice = await Invoice.clone(existingInvoice);
    res.status(201).json(newInvoice);
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

export default { fetchInvoices, createInvoice, fetchInvoice, cloneInvoice, updateInvoice, deleteInvoice };