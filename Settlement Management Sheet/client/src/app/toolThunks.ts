// toolThunks.ts
import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';
import { addTool } from './toolSlice.ts';
import { addTab } from 'features/sidePanel/sidePanelSlice.ts';
import { v4 as newId } from 'uuid';
import { RootState } from './store.js';
import { ToolName, ToolData, TabData } from './types.js';

// Define the shape of the thunk's return type
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  any
>;

interface LoadToolParams {
  tool: ToolName;
  refId: string;
  id: string;
  currentTool?: ToolName;
  mode?: 'preview' | 'edit';
}

interface ReturnToolParams {
  tool: ToolName;
  refId: string;
  id: string;
}

export const loadTool =
  ({
    tool,
    refId,
    id,
    currentTool,
    mode = 'preview',
  }: LoadToolParams): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const usedTool = currentTool || tool;
    console.log('usedTool', tool, refId, id, currentTool);

    // Prefetch the tool data
    await queryClient.prefetchQuery({
      queryKey: [usedTool, id],
      queryFn: async () => {
        const { data } = await api.get(`/tools/getItem`, {
          params: {
            tool: usedTool,
            refId,
            id,
          },
        });
        return data as ToolData;
      },
    });

    // Retrieve the cached item
    const cachedItem = queryClient.getQueryData<ToolData>([usedTool, id]);
    console.log('cachedItem', cachedItem);

    // If the tool is not already in the Redux store, add it
    if (cachedItem && !state.tools[usedTool].static.byId[id]) {
      dispatch(addTool({ tool: usedTool, data: cachedItem }));
    }

    // Add a new tab
    const newTab: TabData = {
      name: cachedItem?.name || 'Untitled',
      id: cachedItem?.id || id,
      mode,
      type: usedTool,
      tabId: newId(),
      scroll: 0,
      activate: true,
      side: 'right',
    };

    dispatch(addTab(newTab));
  };

export const returnTool = async ({
  tool,
  refId,
  id,
}: ReturnToolParams): Promise<ToolData | undefined> => {
  // Prefetch the tool data
  await queryClient.prefetchQuery({
    queryKey: [tool, id],
    queryFn: async () => {
      const { data } = await api.get('/tools/getItem', {
        params: {
          tool,
          refId,
          id,
        },
      });
      return data as ToolData;
    },
  });

  // Return the cached item
  return queryClient.getQueryData<ToolData>([tool, id]);
};
