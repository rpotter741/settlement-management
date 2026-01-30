import { ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

import getGlossariesThunk from './glossary/glossary/getGlossariesThunk.js';
import getNodesThunk from './glossary/nodes/getNodesThunk.js';
import getEntryByIdThunk from './glossary/entries/getEntryByIdThunk.js';
import createGlossaryThunk from './glossary/glossary/createGlossaryThunk.js';
import renameNodeAndEntryThunk from './glossary/nodes/renameNodeAndEntryThunk.js';
import updateGlossaryThunk from './glossary/glossary/updateGlossaryThunk.js';
import addAndActivateGlossaryThunk from './glossary/glossary/addAndActivateGlossaryThunk.js';
import deleteEntryThunk from './glossary/entries/deleteEntryThunk.js';
import getOptionsByPropertyThunk from './glossary/entries/getOptionsByPropertyThunk.js';
import openEditGlossaryThunk from './glossary/glossary/openEditGlossaryThunk.js';
import deleteGlossaryThunk from './glossary/glossary/deleteGlossaryThunk.js';
import updateEntryByIdThunk from './glossary/entries/updateEntryById.js';
import createNodeAndEntryThunk from './glossary/nodes/createNodeAndEntryThunk.js';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  any
>;

const thunks = {
  getGlossaries: getGlossariesThunk,
  getNodes: getNodesThunk,
  createGlossary: createGlossaryThunk,
  renameNodeAndEntry: renameNodeAndEntryThunk,
  deleteEntry: deleteEntryThunk,
  updateGlossary: updateGlossaryThunk,
  addAndActivateGlossary: addAndActivateGlossaryThunk,
  getEntryById: getEntryByIdThunk,
  updateEntryById: updateEntryByIdThunk,
  getOptionsByProperty: getOptionsByPropertyThunk,
  openEditGlossary: openEditGlossaryThunk,
  deleteGlossary: deleteGlossaryThunk,
  createNodeAndEntryThunk,
};

export default thunks;
