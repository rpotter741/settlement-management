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
  getNodes,
  renameNodeAndEntry,
  updateNodeParentId,
  updateNodeSortIndices,
  createNodeAndEntry,
  // entry actions
  deleteNodeAndEntry,
  getEntryById,
  getOptionsByProperty,
  updateNode,
  updateEntry,
  changeEntrySubTypeController,
  getEntriesById,
  //subType actions
  createSubType,
  fetchSubTypesByUserId,
  fetchSystemSubTypes,
  batchUpdateSubType,
  deleteSubType,
  forkSubType,
  //new stuff here
  fetchSubTypePropertiesController,
  createSubTypeProperty,
  createSubTypeGroup,
  fetchSubTypeGroupsController,
  deleteSubTypePropertyController,
  createSubTypeGroupPropertyController,
  removeGroupPropertyController,
  reorderGroupPropertiesController,
  updateSubTypeGroupController,
  updateSubTypePropertyController,
  deleteSubTypeGroupController,
  addGroupsToSubTypeController,
  removeGroupsFromSubTypeController,
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
router.post('/nodes/create', createNodeAndEntry);
router.get('/nodes/:glossaryId', getNodes);
router.post('/node/rename', renameNodeAndEntry);
router.post('/node/parent', updateNodeParentId);
router.post('/node/sort', updateNodeSortIndices);

// entry routes
router.post('/entry/delete', deleteNodeAndEntry);
router.get('/entries/:id', getEntryById);
router.post('/optionsByProperty', getOptionsByProperty);
router.post('/node/update', updateNode);
router.patch('/entry/update', updateEntry);
router.post('/entry/change-sub-type', changeEntrySubTypeController);
router.post('/entries', getEntriesById);

//subType routes
router.post('/subTypes/create', createSubType);
router.get('/subTypes/user', fetchSubTypesByUserId);
router.get('/subTypes/system', fetchSystemSubTypes);
router.post('/subTypes/update', batchUpdateSubType);
router.post('/subTypes/delete', deleteSubType);
router.post('/subTypes/fork', forkSubType);
// the new stuff here
router.get('/subTypes/properties', fetchSubTypePropertiesController);
router.post('/subTypes/properties', createSubTypeProperty);
router.get('/subTypes/groups', fetchSubTypeGroupsController);
router.post('/subTypes/groups', createSubTypeGroup);
router.post('/subtypes/properties/delete', deleteSubTypePropertyController);
router.post(
  '/subtypes/groups/properties',
  createSubTypeGroupPropertyController
);
router.post(
  '/subtypes/groups/properties/delete',
  removeGroupPropertyController
);
router.post('/subtypes/groups/delete', deleteSubTypeGroupController);
router.post(
  '/subtypes/groups/properties/reorder',
  reorderGroupPropertiesController
);
router.patch('/subtypes/groups/update', updateSubTypeGroupController);
router.patch('/subtypes/properties/update', updateSubTypePropertyController);
router.post('/subtypes/addGroup', addGroupsToSubTypeController);
router.post('/subtypes/removeGroups', removeGroupsFromSubTypeController);

export default router;
