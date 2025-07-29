import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { TabDataPayload, ToolName } from '@/app/types/ToolTypes.js';
import { v4 as newId } from 'uuid';
import { addTool } from '@/app/slice/toolSlice.js';
import { addTab } from '@/app/slice/tabSlice.js';
import api from '@/services/interceptor.js';
import queryClient from 'context/QueryClient.js';

import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { Tool } from '../../../../../shared/types/common.js';
import toolServices from '@/services/toolServices.js';

interface LoadToolParams {
  tool: ToolName;
  refId: string;
  id: string;
  currentTool?: ToolName;
  mode?: 'preview' | 'edit';
  side?: 'left' | 'right';
}

export default function loadTool({
  tool,
  refId,
  id,
  currentTool,
  mode = 'preview',
  side = 'right',
}: LoadToolParams): AppThunk {
  return async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    const state = getState();
    const usedTool = currentTool || tool;

    try {
      // Prefetch the tool data
      await queryClient.prefetchQuery({
        queryKey: [usedTool, id],
        queryFn: async () => {
          const data = await toolServices.getItem({
            tool: usedTool,
            refId,
            id,
          });
          return data as Tool;
        },
      });

      // Retrieve the cached item
      const cachedItem = queryClient.getQueryData<Tool>([usedTool, id]);

      // If the tool is not already in the Redux store, add it
      if (cachedItem && !state.tools[usedTool].static.byId[id]) {
        dispatch(addTool({ tool: usedTool, data: cachedItem }));
      }

      const toolSplit: Partial<Record<ToolName, boolean>> = {
        event: true,
        apt: true,
        storyThread: true,
      };

      // Add a new tab
      const newTab: TabDataPayload = {
        name: cachedItem?.name || 'Untitled',
        id: cachedItem?.id || id,
        mode,
        tool: usedTool,
        tabId: newId(),
        scroll: 0,
        activate: true,
        side,
        preventSplit: toolSplit[usedTool] ?? false,
        tabType: 'tool',
      };

      dispatch(addTab(newTab));
    } catch (error) {
      dispatch(
        showSnackbar({
          message: 'Error loading tool. Sorry! Try again later.',
          type: 'error',
        })
      );
    }
  };
}
