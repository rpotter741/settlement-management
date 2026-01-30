import { Tab } from '@/app/types/TabTypes.js';
import { useTools } from './useTools.js';
import { ToolName } from 'types/common.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { cancelToolEdit } from '@/app/thunks/toolThunks.js';
import { updateTab } from '@/app/slice/tabSlice.js';

export const useFileMenu = (tab: Tab) => {
  const dispatch: AppDispatch = useDispatch();
  const toolHook =
    tab.tabType === 'tool' ? useTools(tab.tool as ToolName, tab.id) : null;

  const discardChanges = () => {
    if (toolHook) {
      dispatch(
        updateTab({
          tabId: tab.tabId,
          side: tab.side,
          keypath: 'mode',
          updates: { mode: 'preview' },
        })
      );
      dispatch(
        cancelToolEdit({
          tool: tab.tool as ToolName,
          id: tab.id,
          tabId: tab.tabId,
          side: tab.side,
          validationFields: [],
        })
      );
      return;
    }
  };
};
