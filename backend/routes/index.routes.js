import express from 'express';

import invoiceRoutes from './invoices.routes.js';
import linesRoutes from './lines.routes.js';

const router = express.Router();

router.use('/api/v1/invoices', invoiceRoutes);
router.use('/api/v1/invoices/:invoiceId/lines', linesRoutes);

export default router;