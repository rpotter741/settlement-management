// glossary services
import createGlossary from './glossary/createGlossary.js';
import deleteGlossary from './glossary/deleteGlossary.js';
import getGlossaries from './glossary/getGlossaries.js';
import getGlossaryById from './glossary/getGlossaryById.js';
import updateGlossary from './glossary/updateGlossary.js';
import updateGlossaryTerm from './glossary/updateGlossaryTerm.js';
import batchUpdateTerms from './glossary/batchUpdateTerms.js';
// node services
import createNodeAndDetail from './glossary/nodes/createNodeAndDetail.js';
import createNodeAndSection from './glossary/nodes/createNodeAndSection.js';
import getNodes from './glossary/nodes/getNodes.js';
import renameNodeAndEntry from './glossary/nodes/renameNodeAndEntry.js';
import updateNodeParentId from './glossary/nodes/updateNodeParentId.js';
import updateNodeSortIndexes from './glossary/nodes/updateNodeSortIndices.js';
// entry services
import deleteEntry from './glossary/entry/deleteEntry.js';
import getEntryById from './glossary/entry/getEntryById.js';
import getOptionsByProperty from './glossary/entry/getOptionsByProperty.js';
import getEntrySubModel from './glossary/entry/getEntrySubModel.js';
import updateEntrySubModel from './glossary/entry/updateEntrySubModel.js';
//subType services
import createSubType from './glossary/subTypes/createSubType.js';

const actions = {
  // glossary actions
  createGlossary,
  deleteGlossary,
  getGlossaries,
  getGlossaryById,
  updateGlossary,
  updateGlossaryTerm,
  batchUpdateTerms,
  // node actions
  createNodeAndDetail,
  createNodeAndSection,
  getNodes,
  renameNodeAndEntry,
  updateNodeParentId,
  updateNodeSortIndexes,
  // entry actions
  deleteEntry,
  getEntryById,
  getOptionsByProperty,
  getEntrySubModel,
  updateEntrySubModel,
  //subType actions
  createSubType,
};

export default actions;
