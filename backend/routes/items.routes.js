import express from 'express';

import itemsController from '../controllers/item.controller.js';
import { checkItemExists } from '../middleware/item.middleware.js';
import validate from '../middleware/validate.middleware.js';
import itemRules from '../models/item.rules.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .post(validate(itemRules), itemsController.createItem);

router.route('/:itemId')
    .delete(checkItemExists, itemsController.deleteItem);

export default router;