import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.ts';

import {
  // glossary actions
  createGlossary,
  deleteGlossary,
  getGlossaries,
  getGlossaryById,
  updateGlossary,
  // node actions
  createNodeAndSection,
  createNodeAndDetail,
  getNodes,
  renameNodeAndEntry,
  updateNodeParentId,
  updateNodeSortIndices,
  // entry actions
  deleteNodeAndEntry,
  getEntryById,
  getOptionsByProperty,
  updateNode,
} from '../controllers/glossaryController.ts';

const router = express.Router();

//glossary routes
router.post('/', createGlossary);
router.post('/delete', deleteGlossary);
router.get('/', getGlossaries);
router.get('/:id', getGlossaryById);
router.post('/update', updateGlossary);

// node routes
router.post('/section', createNodeAndSection);
router.post('/detail', createNodeAndDetail);
router.get('/nodes/:glossaryId', getNodes);
router.post('/node/rename', renameNodeAndEntry);
router.post('/node/parent', updateNodeParentId);
router.post('/node/sort', updateNodeSortIndices);

// entry routes
router.post('/entry/delete', deleteNodeAndEntry);
router.get('/entries/:entryType/:id', getEntryById);
router.post('/optionsByProperty', getOptionsByProperty);
router.post('/node/update', updateNode);

export default router;
