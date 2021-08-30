import express from 'express';

import itemsController from '../controllers/item.controller.js';
import { checkItemExists } from '../middleware/item.middleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(itemsController.createItem);

router.route('/:itemId')
    .delete(checkItemExists, itemsController.deleteItem);

export default router;