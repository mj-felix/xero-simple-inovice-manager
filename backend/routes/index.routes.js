import express from 'express';

import invoiceRoutes from './invoices.routes.js';
import itemsRoutes from './items.routes.js';
import { checkInvoiceExists } from '../middleware/invoice.middleware.js';

const router = express.Router();

router.use('/api/v1/invoices', invoiceRoutes);
router.use('/api/v1/invoices/:invoiceId/items', checkInvoiceExists, itemsRoutes);

export default router;