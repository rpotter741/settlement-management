// toolThunks.ts
import { ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import queryClient from '../../context/QueryClient.js';
import api from '../../services/interceptor.js';
import { addTool, revertToStatic, updateById } from '../slice/toolSlice.js';
import { addTab, setTabDirty, updateTab } from '../slice/sidePanelSlice.js';
import { v4 as newId } from 'uuid';
import { RootState } from '../store.js';
import { ToolName, Tool } from '../../../../types/index.js';
import { TabDataPayload } from '../types/ToolTypes.js';
import {
  selectEditToolById,
  selectToolById,
} from '../selectors/toolSelectors.js';
import { isEqual } from 'lodash';
import { isTabDirty } from '../selectors/sidePanelSelectors.js';
import { validateTool } from '../slice/validationSlice.js';

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

export const updateDirtyTool =
  ({
    id,
    tool,
    keypath,
    updates,
  }: {
    id: string;
    tool: ToolName;
    keypath: string;
    updates: any;
  }): AppThunk =>
  async (
    dispatch: ThunkDispatch<RootState, unknown, any>,
    getState: () => RootState
  ) => {
    dispatch(updateById({ tool, id, keypath, updates }));
    const state = getState();
    const base = selectToolById(tool, id)(state);
    if (!base) return;
    const edit = selectEditToolById(tool, id)(state);
    if (!edit) return;
    const currentDirtyState = isTabDirty(id)(state);
    const isDirty = !isEqual(base, edit);
    if (currentDirtyState === isDirty) return;
    dispatch(setTabDirty({ id, isDirty }));
  };

export const cancelToolEdit =
  ({
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
  }): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const current = selectToolById(tool, id)(state);
    const edit = selectEditToolById(tool, id)(state);

    dispatch(updateTab({ tabId, side, keypath: 'mode', updates: 'preview' }));

    if (current?.name !== edit?.name) {
      dispatch(
        updateTab({
          tabId,
          side,
          keypath: 'name',
          updates: current?.name || 'Untitled',
        })
      );
    }

    dispatch(revertToStatic({ tool, id }));
    dispatch(setTabDirty({ id, isDirty: false }));
    dispatch(
      validateTool({ tool, id, fields: validationFields, refObj: current })
    );
  };
