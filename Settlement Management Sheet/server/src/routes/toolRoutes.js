import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.js';

import {
  getContent,
  saveContent,
  deleteContent,
} from '../controllers/toolController.js';

const router = express.Router();

router.get('/:tool/:scope', getContent);

router.post('/:tool/save', saveContent);

router.post('/:tool/delete', deleteContent);

export default router;
