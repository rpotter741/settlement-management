//@ts-ignore
import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.ts';

import {
  // glossary actions
  createGlossary,
  deleteGlossary,
  getGlossaries,
  getGlossaryById,
  updateGlossary,
  updateGlossaryTerm,
  batchUpdateTerms,
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
  getEntrySubModel,
  updateEntrySubModel,
} from '../controllers/glossaryController.ts';

const router = express.Router();

//glossary routes
router.post('/', createGlossary);
router.post('/delete', deleteGlossary);
router.get('/', getGlossaries);
router.get('/:id', getGlossaryById);
router.post('/update', updateGlossary);
router.post('/term/update', updateGlossaryTerm);
router.post('/batchUpdateTerms', batchUpdateTerms);

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
router.get('/entry/subModel', getEntrySubModel);
router.patch('/entry/subModel/update', updateEntrySubModel);

export default router;
