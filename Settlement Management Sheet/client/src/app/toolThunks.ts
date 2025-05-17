// toolThunks.ts
import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import queryClient from '../context/QueryClient.js';
import api from '../services/interceptor.js';
import { addTool } from './toolSlice.js';
import { addTab } from '../features/SidePanel/sidePanelSlice.js';
import { v4 as newId } from 'uuid';
import { RootState } from './store.js';
import { ToolName, Tool } from '../../../types/index.js';
import { TabData } from './types.js';

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
  side?: 'left' | 'right';
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
    side = 'right',
  }: LoadToolParams): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const usedTool = currentTool || tool;

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
        return data as Tool;
      },
    });

    // Retrieve the cached item
    const cachedItem = queryClient.getQueryData<Tool>([usedTool, id]);
    console.log('cachedItem', cachedItem);

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
    const newTab: TabData = {
      name: cachedItem?.name || 'Untitled',
      id: cachedItem?.id || id,
      mode,
      tool: usedTool,
      tabId: newId(),
      scroll: 0,
      activate: true,
      side,
      preventSplit: toolSplit[usedTool] ?? false,
    };

    dispatch(addTab(newTab));
  };

export const returnTool = async ({
  tool,
  refId,
  id,
}: ReturnToolParams): Promise<Tool | undefined> => {
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
      return data as Tool;
    },
  });

  // Return the cached item
  return queryClient.getQueryData<Tool>([tool, id]);
};
