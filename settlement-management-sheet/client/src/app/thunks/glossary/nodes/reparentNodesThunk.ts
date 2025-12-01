import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '@/services/glossaryServices.js';
import { updateGlossaryNode } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { cloneDeep } from 'lodash';
import { selectEditNodeById } from '@/app/selectors/glossarySelectors.js';
import { GlossaryNode } from 'types/glossaryEntry.js';
import { updateTab } from '@/app/slice/tabSlice.js';

export default function reparentNodesThunk({
  glossaryId,
  nodes,
  newParentId,
}: {
  glossaryId: string;
  nodes: GlossaryNode[];
  newParentId: string | null;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    const backupNodes = nodes.map((node) =>
      cloneDeep(selectEditNodeById(glossaryId, node.id)(getState()))
    );
  };
}
