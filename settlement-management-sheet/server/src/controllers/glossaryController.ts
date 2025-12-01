// glossary actions
import getGlossaries from './glossary/glossary/getGlossaries.ts';
import createGlossary from './glossary/glossary/createGlossary.ts';
import updateGlossary from './glossary/glossary/updateGlossary.ts';
import deleteGlossary from './glossary/glossary/deleteGlossary.ts';
import getGlossaryById from './glossary/glossary/getGlossaryById.ts';
import updateGlossaryTerm from './glossary/glossary/updateGlossaryTerm.ts';
import batchUpdateTerms from './glossary/glossary/batchUpdateTerms.ts';

// node actions
import updateNodeSortIndices from './glossary/nodes/updateNodeSortIndices.ts';
import updateNodeParentId from './glossary/nodes/updateNodeParentId.ts';
import updateNode from './glossary/nodes/updateNode.ts';
import renameNodeAndEntry from './glossary/nodes/renameNodeAndEntry.ts';
import getNodes from './glossary/nodes/getNodes.ts';
import deleteNodeAndEntry from './glossary/nodes/deleteNodeAndEntry.ts';
import createNodeAndEntry from './glossary/nodes/createNodeAndEntry.ts';

// entry actions
import getOptionsByProperty from './glossary/entry/getOptionsByProperty.ts';
import getEntryById from './glossary/entry/getEntryById.ts';
import updateEntry from './glossary/entry/updateEntry.ts';
import changeEntrySubTypeController from './glossary/entry/changeEntrySubTypeController.ts';
import getEntriesById from './glossary/entry/getEntriesById.ts';

//subType actions
import createSubType from './glossary/subTypes/createSubType.ts';
import fetchSubTypesByUserId from './glossary/subTypes/fetchSubTypesByUserId.ts';
import fetchSystemSubTypes from './glossary/subTypes/fetchSystemSubTypes.ts';
import batchUpdateSubType from './glossary/subTypes/batchUpdateSubType.ts';
import deleteSubType from './glossary/subTypes/deleteSubTypeController.ts';
import forkSubType from './glossary/subTypes/forkSubTypeController.ts';
// the new stuff here
import fetchSubTypePropertiesController from './glossary/subTypes/fetchSubTypePropertiesController.ts';
import createSubTypeProperty from './glossary/subTypes/createSubTypeProperty.ts';
import createSubTypeGroup from './glossary/subTypes/createSubTypeGroupController.ts';
import fetchSubTypeGroupsController from './glossary/subTypes/fetchSubTypeGroupsController.ts';
import deleteSubTypePropertyController from './glossary/subTypes/deleteSubTypePropertyController.ts';
import createSubTypeGroupPropertyController from './glossary/subTypes/createSubTypeGroupProperty.ts';
import removeGroupPropertyController from './glossary/subTypes/removeGroupPropertyController.ts';
import reorderGroupPropertiesController from './glossary/subTypes/reorderGroupPropertiesController.ts';
import updateSubTypeGroupController from './glossary/subTypes/updateSubTypeGroupController.ts';
import updateSubTypePropertyController from './glossary/subTypes/updateSubTypePropertyController.ts';
import deleteSubTypeGroupController from './glossary/subTypes/deleteSubTypeGroupController.ts';
import addGroupsToSubTypeController from './glossary/subTypes/addGroupsToSubtypeController.ts';
import removeGroupsFromSubTypeController from './glossary/subTypes/removeGroupsFromSubTypeController.ts';

export {
  // glossary actions
  getGlossaries,
  createGlossary,
  updateGlossary,
  deleteGlossary,
  getGlossaryById,
  updateGlossaryTerm,
  batchUpdateTerms,
  // node actions
  updateNodeSortIndices,
  updateNodeParentId,
  updateNode,
  renameNodeAndEntry,
  getNodes,
  deleteNodeAndEntry,
  createNodeAndEntry,
  // entry actions
  getOptionsByProperty,
  getEntryById,
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
  // the new stuff here
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
};
