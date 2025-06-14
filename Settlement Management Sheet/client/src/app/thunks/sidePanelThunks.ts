import { removeTab } from '../slice/sidePanelSlice.js';
import { AppDispatch, RootState } from '../store.js';
import { Tab } from '../types/SidePanelTypes.js';

export const findAndDeleteTab = (id: string) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState().sidePanel;
    const leftTabIndex = state.leftTabs.findIndex((tab: Tab) => tab.id === id);
    const rightTabIndex = state.rightTabs.findIndex(
      (tab: Tab) => tab.id === id
    );

    const leftId = state.leftTabs[leftTabIndex]?.tabId;

    const rightId = state.rightTabs[rightTabIndex]?.tabId;

    if (rightTabIndex !== -1) {
      dispatch(removeTab({ tabId: rightId, side: 'right' }));
    }

    if (leftTabIndex !== -1) {
      dispatch(removeTab({ tabId: leftId, side: 'left' }));
    }
  };
};
