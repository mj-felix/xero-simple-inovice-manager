import express from 'express';

import itemsController from '../controllers/item.controller.js';

const router = express.Router({ mergeParams: true });

// router.route('/')
//     .get(itemsController.fetchItems)
//     .post(itemsController.createItem);

router.route('/:itemId')
    .get(itemsController.fetchItem)
    .patch(itemsController.updateItem)
    .delete(itemsController.deleteItem);

export default router;