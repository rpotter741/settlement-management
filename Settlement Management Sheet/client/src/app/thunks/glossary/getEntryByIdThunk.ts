import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '../../../services/glossaryServices.js';
import { addGlossaryEntry } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryEntry, GlossaryNode } from 'types/index.js';

export default async function getEntryById({
  node,
}: {
  node: GlossaryNode;
}): Promise<AppThunk> {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const existingNode = node;
      const entry = await serverAction.getEntryById({
        nodeId: existingNode.id,
        entryType: existingNode.entryType,
      });
      dispatch(
        addGlossaryEntry({
          glossaryId: existingNode.glossaryId,
          entryId: existingNode.id,
          entryData: entry as GlossaryEntry,
        })
      );
    } catch (error) {
      console.error('Error fetching glossary node:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching glossary node. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
