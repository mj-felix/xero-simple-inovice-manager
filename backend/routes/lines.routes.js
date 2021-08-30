import express from 'express';

import linesController from '../controllers/line.controller.js';

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(linesController.fetchLines)
    .post(linesController.createLine);

router.route('/:lineId')
    .get(linesController.fetchLine)
    .patch(linesController.updateLine)
    .delete(linesController.deleteLine);

export default router;