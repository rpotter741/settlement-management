import { ThunkDispatch } from '@reduxjs/toolkit';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { get, isEqual } from 'lodash';
import { addDirtyKeypath, removeDirtyKeypath } from '@/app/slice/tabSlice.js';
import { ToolName } from '@/app/types/ToolTypes.js';
import { updateById } from '@/app/slice/toolSlice.js';

export default function updateEditAndTabDirty({
  tool,
  id,
  keypath,
  updates,
}: {
  tool: ToolName;
  id: string;
  keypath: string;
  updates: any;
}): AppThunk {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(
      updateById({
        id,
        tool,
        keypath,
        updates,
      })
    );

    const state = getState();
    const current = state.tools[tool].static.byId[id];
    const focusedTabId = state.tabs.focusedTab?.tabId;
    if (!focusedTabId) {
      console.warn('No focused tab found, cannot update dirty state');
      return;
    }
    if (!isEqual(get(current, keypath), updates)) {
      dispatch(
        addDirtyKeypath({
          tabId: focusedTabId,
          keypath,
        })
      );
    } else {
      dispatch(
        removeDirtyKeypath({
          tabId: focusedTabId,
          keypath,
        })
      );
    }
  };
}
