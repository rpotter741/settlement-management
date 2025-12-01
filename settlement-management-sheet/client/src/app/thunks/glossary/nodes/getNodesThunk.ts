import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { setGlossaryNodes } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { rehydrateGlossaryTree } from '@/features/Glossary/utils/rehydrateGlossary.js';

export default function getNodesThunk({
  glossaryId,
}: {
  glossaryId: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const glossary = getState().glossary.glossaries.edit.byId[glossaryId];
      if (glossary.hydrated) return; // already hydrated, no need to fetch again
      const nodes = await serverAction.getNodes({ glossaryId });
      const existingState = glossary.renderState;
      const { nodeMap, roots, renderState } = rehydrateGlossaryTree(
        nodes,
        existingState
      );
      dispatch(
        setGlossaryNodes({
          glossaryId,
          nodes: nodeMap,
          structure: nodes,
          renderState,
        })
      );
    } catch (error) {
      console.error('Error fetching glossary nodes:', error);

      dispatch(
        showSnackbar({
          message: 'Error fetching glossary structure. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
