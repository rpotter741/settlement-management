import { removeTab } from '@/app/slice/tabSlice.js';
import { AppDispatch, RootState } from '../store.js';
import { Tab } from '../types/TabTypes.js';

export const findAndDeleteTab = (id: string) => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const { left, right } = getState().tabs;

    const findTab = (side: 'left' | 'right') => {
      const tabId = (side === 'left' ? left : right).order.find(
        (tabId) =>
          (side === 'left' ? left.data[tabId] : right.data[tabId]).id === id
      );
      return tabId;
    };

    const leftTabId = findTab('left');
    if (leftTabId) {
      dispatch(removeTab({ tabId: leftTabId, side: 'left' }));
      return;
    }

    const rightTabId = findTab('right');
    if (rightTabId) {
      dispatch(removeTab({ tabId: rightTabId, side: 'right' }));
      return;
    }

    console.error('Tab not found in tabThunks: findAndDeleteTab:', id);
  };
};
