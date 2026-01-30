//@ts-ignore
import express from 'express';

import { verifyAuth } from '../middleware/authMiddleware.ts';

import {
  // glossary actions
  createGlossary, // rusty
  deleteGlossary, //rusty
  getGlossaries, // rusty
  getGlossaryById, // rusty
  updateGlossary, //rusty
  updateGlossaryTerm, //rusty -> just use updateGlossary, integrationState only update. Duh.
  batchUpdateTerms, // rusty --> see above
  // node actions
  getNodes, // rusty
  renameNodeAndEntry, //rusty -> also, backlink updates and name tracking removed. Was unnecessary complexity.
  updateNodeParentId, // rusty
  updateNodeSortIndices, // rusty
  createNodeAndEntry, // rusty
  // entry actions
  deleteNodeAndEntry, // rusty
  getEntryById, // rusty
  getOptionsByProperty,
  updateNode, // rusty --> aka, not used anywhere
  updateEntry, // rusty, kind of --> only handles groups! will need a few more commands to handle the other entry updates
  changeEntrySubTypeController, // rusty
  getEntriesById, //rusty
  //subType actions
  createSubType, //rusty
  fetchSubTypesByUserId, // rusty
  fetchSystemSubTypes, // don't need ig
  batchUpdateSubType, // rusty --> going to use ProgressRail and looped updates to backend
  deleteSubType, // rusty
  forkSubType, // old and useless with new format
  //new stuff here
  fetchSubTypePropertiesController, // rusty
  createSubTypeProperty, // rusty
  createSubTypeGroup, // rusty
  fetchSubTypeGroupsController, // rusty
  deleteSubTypePropertyController, // rusty
  createSubTypeGroupPropertyController, // rusty
  removeGroupPropertyController, // rusty
  reorderGroupPropertiesController, //rusty
  updateSubTypeGroupController, // rusty
  updateSubTypePropertyController, // rusty
  deleteSubTypeGroupController, // rusty
  addGroupsToSubTypeController, // rusty
  removeGroupsFromSubTypeController, //rusty
  updateAnchorsController, //rusty
  updateSubTypeNameController, //rusty --> merged into above
  updateSubTypeContextController, // rusty --> merged into above
  //backlinks
  ignoreBacklinkController, // rusty
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
router.patch('/subtypes/anchor/update', updateAnchorsController);
router.patch('/subtypes/name/update', updateSubTypeNameController);
router.patch('/subtypes/context/update', updateSubTypeContextController);

//backlinks
router.patch('/backlinks/toggleIgnore', ignoreBacklinkController);

export default router;
