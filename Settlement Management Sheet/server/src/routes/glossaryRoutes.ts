import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.ts';

import {
  getGlossaries,
  getGlossaryById,
  getGlossaryNodes,
  createGlossary,
  renameNode,
  deleteNode,
  createFolder,
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
router.get('/:id', getGlossaryById);
router.get('/nodes/:glossaryId', getGlossaryNodes);
router.post('/', createGlossary);
router.post('/folder', createFolder);
router.post('/entry', createEntryWithNode);
router.post('/entry/update', updateEntryWithNode);
router.post('/entry/delete', deleteEntryWithNode);
router.post('/node/rename', renameNode);
router.post('/node/delete', deleteNode);
router.post('/node/update', updateNode);
router.post('/node/sort', updateNodeSortIndexes);
router.post('/node/parent', updateNodeParentId);
router.post('/update', updateGlossary);
router.post('/delete', deleteGlossary);

export default router;
