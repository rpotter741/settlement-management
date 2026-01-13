import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';

import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import {
  removeGlossaryEntry,
  updateGlossary,
  updateGlossaryEntry,
  updateGlossaryNode,
} from '@/app/slice/glossarySlice.js';
import { GenericObject } from '../../../../../../shared/types/common.js';
import { cloneDeep, get, set } from 'lodash';
import {
  addBulkDirtyKeypaths,
  addDirtyKeypath,
} from '@/app/slice/dirtySlice.js';
import updateEntryService from '@/services/glossary/entry/updateEntryService.js';

export default function updateEntryById({
  glossaryId,
  entryId,
  content,
  nukedIds,
}: {
  glossaryId: string;
  entryId: string;
  content: Record<string, any>;
  nukedIds?: string[];
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    console.log(nukedIds, 'nukedIds');
    const state = getState();
    const glossary = state.glossary.glossaries.edit.byId[glossaryId];
    if (!glossary) {
      dispatch(
        showSnackbar({
          message: 'Glossary not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const editEntry = glossary.entries[entryId];
    if (!editEntry) {
      dispatch(
        showSnackbar({
          message: 'Entry not found.',
          type: 'error',
          duration: 3000,
        })
      );
      return;
    }
    const semanticContent: Record<string, any> = {};
    Object.entries(content).forEach(([key, value]) => {
      //@ts-ignore
      if (key.includes(editEntry.primaryAnchorId)) {
        semanticContent['primaryAnchorValue'] = value;
      }
      //@ts-ignore
      if (key.includes(editEntry.secondaryAnchorId)) {
        semanticContent['secondaryAnchorValue'] = value;
      }
    });
    try {
      // optimistic first
      dispatch(
        updateGlossaryEntry({
          glossaryId,
          entryId,
          content: { ...content, ...semanticContent },
        })
      );

      // create new entry object to adjust and extract content to send to server
      const newEntry = cloneDeep(editEntry);
      Object.entries(content).forEach(([key, value]) => {
        set(newEntry, key, value);
      });

      await updateEntryService({
        id: entryId,
        subTypeId: editEntry.subTypeId,
        groups: newEntry.groups,
        primaryAnchorValue: newEntry.primaryAnchorValue,
        secondaryAnchorValue: newEntry.secondaryAnchorValue,
      }).then(async (res) => {
        if (nukedIds) {
          // yeah side effects are ugly but whatever this works for now.
          console.log(nukedIds);
          nukedIds.forEach((entryId) => {
            dispatch(
              removeGlossaryEntry({
                glossaryId,
                entryId,
              })
            );
          });
        }
        const { entry, backlinksTo, backlinksFrom } =
          await serverAction.getEntryById({
            nodeId: entryId,
            entryType: editEntry.entryType,
          });
        dispatch(
          updateGlossaryEntry({
            glossaryId,
            entryId,
            content: {
              backlinksTo,
              backlinksFrom,
            },
          })
        );
      });
      // dispatch(
      //   addBulkDirtyKeypaths({
      //     scope: 'glossary',
      //     id: entryId,
      //     keypaths: Object.keys(content),
      //   })
      // );
    } catch (error) {
      console.error('Error updating entry:', error);
      dispatch(
        showSnackbar({
          message: `Error updating ${editEntry.name}. Try again later.`,
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
