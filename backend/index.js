import express from 'express';
import morgan from 'morgan';

import { notFoundError, errorHandler } from './middleware/error.middleware.js';
// import routes from './routes/index.routers.js';

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan(':user-agent :date[iso] :method :url :status :response-time ms - :res[content-length]'));
}

// Routes
// app.use('/', routes);

app.get('/', (req, res) => {
    res.send('API is running ...');
});

// Error handling
app.use(notFoundError);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`${new Date().toString()}: Server started on port ${port}`);
});