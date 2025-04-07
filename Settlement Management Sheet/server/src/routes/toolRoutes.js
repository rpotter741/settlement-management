import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.js';

import { getContent } from '../controllers/toolController.js';

const router = express.Router();

router.get('/:tool/:scope', getContent);

export default router;
