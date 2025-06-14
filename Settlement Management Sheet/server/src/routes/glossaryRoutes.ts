import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.ts';

import {
  getGlossaries,
  getGlossaryNodes,
  getGlossaryEntryById,
  createGlossary,
  updateNode,
  updateNodeSortIndexes,
  updateNodeParentId,
  updateGlossary,
  deleteGlossary,
  createEntryWithNode,
  deleteEntryWithNode,
  updateEntryWithNode,
} from '../controllers/glossaryController.ts';

const router = express.Router();

router.get('/', getGlossaries);
router.get('/nodes/:glossaryId', getGlossaryNodes);
router.get('/entries/:entryType/:id', getGlossaryEntryById);
router.post('/', createGlossary);
router.post('/entry', createEntryWithNode);
router.post('/entry/update', updateEntryWithNode);
router.post('/entry/delete', deleteEntryWithNode);
router.post('/node/update', updateNode);
router.post('/node/sort', updateNodeSortIndexes);
router.post('/node/parent', updateNodeParentId);
router.post('/update', updateGlossary);
router.post('/delete', deleteGlossary);

export default router;
