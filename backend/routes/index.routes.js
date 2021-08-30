import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from "swagger-jsdoc";

import invoiceRoutes from './invoices.routes.js';
import itemsRoutes from './items.routes.js';
import { checkInvoiceExists } from '../middleware/invoice.middleware.js';

const router = express.Router();

router.use('/api/v1/invoices', invoiceRoutes);
router.use('/api/v1/invoices/:invoiceId/items', checkInvoiceExists, itemsRoutes);

// Swagger API documentation
const swaggerDocument = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Xero Simple Invoice Manager API",
            version: "1.0.0",
            description: "Programming task for the position of Software Engineer - Work on the Xero product",
        }
    },
    apis: ['./backend/routes/*.js'],
});

router.use('/api/v1/docs', swaggerUi.serve);
router.get('/api/v1/docs', swaggerUi.setup(swaggerDocument));

export default router;