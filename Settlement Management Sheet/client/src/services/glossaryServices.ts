// glossary services
import createGlossary from './glossary/createGlossary.js';
import deleteGlossary from './glossary/deleteGlossary.js';
import getGlossaries from './glossary/getGlossaries.js';
import getGlossaryById from './glossary/getGlossaryById.js';
import updateGlossary from './glossary/updateGlossary.js';
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

const actions = {
  // glossary actions
  createGlossary,
  deleteGlossary,
  getGlossaries,
  getGlossaryById,
  updateGlossary,
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
};

export default actions;
