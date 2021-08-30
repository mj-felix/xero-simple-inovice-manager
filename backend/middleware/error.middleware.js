import errors from '../messages/error.messages.js';

const notFoundError = (req, res, next) => {
    const err = new Error(`${errors.app.NOT_FOUND}: ${req.originalUrl}`);
    res.status(404);
    next(err);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = (!res.statusCode || res.statusCode === 200) ? 500 : res.statusCode;
    res.status(statusCode);
    const json = { message: err.message };
    if (process.env.NODE_ENV !== 'production') {
        json.stack = err.stack;
    }
    res.json(json);
};

export { notFoundError, errorHandler };