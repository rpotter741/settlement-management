import { ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

import getGlossariesThunk from './glossary/getGlossariesThunk.js';
import getNodesThunk from './glossary/getNodesThunk.js';
import getEntryByIdThunk from './glossary/getEntryByIdThunk.js';
import createGlossaryThunk from './glossary/createGlossaryThunk.js';
import createNodeAndSectionThunk from './glossary/createNodeAndSectionThunk.js';
import renameNodeAndEntryThunk from './glossary/renameNodeAndEntryThunk.js';
import updateGlossaryThunk from './glossary/updateGlossaryThunk.js';
import addAndActivateGlossaryThunk from './glossary/addAndActivateGlossaryThunk.js';
import deleteEntryThunk from './glossary/deleteEntryThunk.js';
import getOptionsByPropertyThunk from './glossary/getOptionsByPropertyThunk.js';
import openEditGlossaryThunk from './glossary/openEditGlossaryThunk.js';
import createNodeAndDetailThunk from './glossary/createNodeAndDetailThunk.js';
import deleteGlossaryThunk from './glossary/deleteGlossaryThunk.js';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  any
>;

// export const updateEntry =
//   ({
//     node,
//     content,
//   }: {
//     node: GlossaryNode;
//     content?: Record<string, any>;
//   }): AppThunk =>
//   async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
//     const { id, entryType, fileType, glossaryId } = node;
//     console.log('Updating entry:', content);
//     const backupNode = cloneDeep(selectNodeById(glossaryId, id)(getState()));
//     const updatedNode = { ...node, name: content?.name || node.name };
//     dispatch(
//       updateGlossaryNode({ glossaryId, nodeId: id, nodeData: updatedNode })
//     );
//     const backupEntry = cloneDeep(selectEntryById(glossaryId, id)(getState()));
//     dispatch(
//       updateGlossaryEntry({
//         glossaryId,
//         entryId: id,
//         content: { ...backupEntry, ...content },
//       })
//     );
//     try {
//       await serverAction.updateEntry({
//         id,
//         entryType,
//         fileType,
//         entryData: content,
//       });
//     } catch (error) {
//       console.error('Error updating node:', error);
//       dispatch(
//         updateGlossaryNode({
//           glossaryId,
//           nodeId: id,
//           nodeData: { ...backupNode },
//         })
//       );
//       dispatch(
//         showSnackbar({
//           message: `${node.name} failed to update. Try again later.`,
//           type: 'error',
//           duration: 3000,
//         })
//       );
//     }
//   };

const thunks = {
  getGlossaries: getGlossariesThunk,
  getNodes: getNodesThunk,
  createGlossary: createGlossaryThunk,
  createNodeAndSection: createNodeAndSectionThunk,
  createNodeAndDetail: createNodeAndDetailThunk,
  renameNodeAndEntry: renameNodeAndEntryThunk,
  deleteEntry: deleteEntryThunk,
  updateGlossary: updateGlossaryThunk,
  addAndActivateGlossary: addAndActivateGlossaryThunk,
  getEntryById: getEntryByIdThunk,
  getOptionsByProperty: getOptionsByPropertyThunk,
  openEditGlossary: openEditGlossaryThunk,
  deleteGlossary: deleteGlossaryThunk,
};

export default thunks;
