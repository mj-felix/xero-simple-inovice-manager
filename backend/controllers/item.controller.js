import asyncHandler from 'express-async-handler';

const fetchItems = asyncHandler(async (req, res) => {
    res.json('fetchItems');
});

const createItem = asyncHandler(async (req, res) => {
    res.json('createItem');
});

const fetchItem = asyncHandler(async (req, res) => {
    res.json('fetchItem');
});

const updateItem = asyncHandler(async (req, res) => {
    res.json('updateItems');
});

const deleteItem = asyncHandler(async (req, res) => {
    res.json('deleteItems');
});

export default { fetchItems, createItem, fetchItem, updateItem, deleteItem };