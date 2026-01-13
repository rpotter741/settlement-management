import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { batchUpdateById } from '@/app/slice/toolSlice.js';
import { ToolName } from '@/app/types/ToolTypes.js';
// import { clearDirtyKeypaths } from '@/app/slice/tabSlice.js';
import { cloneDeep, get } from 'lodash';
import { GenericObject } from '../../../../../shared/types/common.js';
import toolServices from '@/services/toolServices.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';

export default function batchUpdateToolThunk({
  id,
  tool,
  tabId,
  side,
}: {
  id: string;
  side: 'left' | 'right';
  tabId: string;
  tool: ToolName;
}): AppThunk {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const state = getState();
    const editTool = cloneDeep(state.tools[tool].edit.byId[id]);
    const tabDirtyKeypaths = Object.keys(
      //@ts-ignore
      state.tabs[side].data[tabId]?.viewState?.dirtyKeypaths || {}
    );
    if (tabDirtyKeypaths.length === 0) return;
    const updates: GenericObject = {};
    tabDirtyKeypaths.forEach((keypath) => {
      const objectKeypath = keypath.split('.').shift();
      updates[objectKeypath as keyof typeof updates] = get(
        editTool,
        objectKeypath as string
      );
    });
    dispatch(
      batchUpdateById({ tool, id, updates: { ...updates, version: 1 } })
    );
    // dispatch(
    //   clearDirtyKeypaths({
    //     tabId,
    //   })
    // );
    try {
      if (editTool.version === 0) {
        await toolServices.saveTool({
          id,
          tool,
          data: { ...editTool, version: 1 },
        });
      } else {
        await toolServices.saveTool({
          id,
          tool,
          data: { ...updates },
        });
      }
    } catch (error) {
      console.error('Error during batch update:', error);
      dispatch(
        showSnackbar({
          message: `Failed to batch update ${editTool.name}. Please try again.`,
          type: 'error',
          duration: 5000,
        })
      );
      dispatch(
        batchUpdateById({
          tool,
          id,
          updates: { ...editTool }, // Revert changes if save fails
        })
      );
    }
  };
}
