import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.js';

import {
  getContent,
  saveContent,
  deleteContent,
  getItem,
  fetchByIds,
  checkKey,
  getContentByName,
} from '../controllers/toolController.js';

const router = express.Router();

router.get('/content', getContent);

router.get('/contentByName', getContentByName);

router.get('/getItem', getItem);

router.post('/fetchByIds', fetchByIds);

router.post('/:tool/save', saveContent);

router.post('/:tool/delete', deleteContent);

router.get('/keys/check', checkKey);

export default router;
