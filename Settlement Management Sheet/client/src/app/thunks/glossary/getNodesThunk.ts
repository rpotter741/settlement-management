import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '../../../services/glossaryServices.js';
import { setGlossaryNodes } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { rehydrateGlossaryTree } from '@/features/Glossary/helpers/rehydrateGlossary.js';

export default async function getNodesThunk({
  glossaryId,
}: {
  glossaryId: string;
}): Promise<AppThunk> {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const glossary = getState().glossary.glossaries[glossaryId];
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
