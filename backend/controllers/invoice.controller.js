import asyncHandler from 'express-async-handler';

const fetchInvoices = asyncHandler(async (req, res) => {
    res.json('fetchInvoices');
});

const createInvoice = asyncHandler(async (req, res) => {
    res.json('createInvoiceOrMergeInvoices');
});

const fetchInvoice = asyncHandler(async (req, res) => {
    res.json('fetchInvoice');
});

const cloneInvoice = asyncHandler(async (req, res) => {
    res.json('cloneInvoice');
});

const updateInvoice = asyncHandler(async (req, res) => {
    res.json('updateInvoice');
});

const deleteInvoice = asyncHandler(async (req, res) => {
    res.json('deleteInvoice');
});

export default { fetchInvoices, createInvoice, fetchInvoice, cloneInvoice, updateInvoice, deleteInvoice };