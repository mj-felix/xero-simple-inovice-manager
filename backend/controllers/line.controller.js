import asyncHandler from 'express-async-handler';

const fetchLines = asyncHandler(async (req, res) => {
    res.json('fetchLines');
});

const createLine = asyncHandler(async (req, res) => {
    res.json('createLine');
});

const fetchLine = asyncHandler(async (req, res) => {
    res.json('fetchLine');
});

const updateLine = asyncHandler(async (req, res) => {
    res.json('updateLine');
});

const deleteLine = asyncHandler(async (req, res) => {
    res.json('deleteLine');
});

export default { fetchLines, createLine, fetchLine, updateLine, deleteLine };