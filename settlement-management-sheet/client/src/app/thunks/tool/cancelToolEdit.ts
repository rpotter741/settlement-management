// toolThunks.ts
import { ThunkDispatch } from '@reduxjs/toolkit';
import { revertToStatic } from '@/app/slice/toolSlice.js';
import { updateTab } from '@/app//slice/tabSlice.js';
import { RootState } from '@/app/store.js';
import { ToolName } from 'types/index.js';
import {
  selectEditToolById,
  selectToolById,
} from '@/app/selectors/toolSelectors.js';
import { validateTool } from '@/app/slice/validationSlice.js';

export default async function cancelToolEdit({
  tool,
  id,
  tabId,
  side,
  validationFields,
}: {
  tool: ToolName;
  id: string;
  tabId: string;
  side: 'left' | 'right';
  validationFields: string[];
}) {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const state = getState();
    const current = selectToolById(tool, id)(state);
    const edit = selectEditToolById(tool, id)(state);
    dispatch(updateTab({ tabId, keypath: 'mode', updates: 'preview' }));

    if (current?.name !== edit?.name) {
      dispatch(
        updateTab({
          tabId,
          keypath: 'name',
          updates: current?.name || 'Untitled',
        })
      );
    }

    dispatch(revertToStatic({ tool, id }));
    // dispatch(clearDirtyKeypaths({ tabId }));
    dispatch(
      validateTool({ tool, id, fields: validationFields, refObj: current })
    );
  };
}
