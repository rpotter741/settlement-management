//@ts-ignore
import express from 'express';

// import { verifyAuth } from '../middleware/authMiddleware.js';

import {
  getTools,
  saveTool,
  deleteTool,
  getToolById,
  fetchByIds,
  getToolsByName,
} from '../controllers/toolController.ts';

const router = express.Router();

router.get('/content', getTools);

router.get('/toolsByName', getToolsByName);

router.get('/byId', getToolById);

router.post('/fetchByIds', fetchByIds);

router.post('/save', saveTool);

router.post('/delete', deleteTool);

export default router;
