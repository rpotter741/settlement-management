import { selectRelayById } from '@/app/selectors/relaySelectors.js';
import { addData, clearRelay } from '@/app/slice/relaySlice.js';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export interface RelayChainReturn<T> {
  [key: string]: any | null;
}

export function useRelayChain<T = unknown>(ids: string[]): RelayChainReturn<T> {
  const dispatch = useDispatch();
  const currentRelay = useSelector(selectRelayById(ids[0]));
  const allRelays = [...ids];

  const data = (currentRelay?.data as T | null) ?? null;
  const status = currentRelay?.status ?? 'pending';

  const updateRelay = (data: T) => {
    dispatch(addData({ id: ids[0], data }));
  };

  const removeRelay = (id: string) => {
    allRelays.filter((r) => r !== id);
  };

  const clearRelays = () => {
    dispatch(clearRelay({ id: ids[0] }));
  };

  const skipRelay = () => {
    removeRelay(ids[0]);
  };

  // If the current relay is complete, initialize the next relay in the chain
  useEffect(() => {
    if (status === 'complete' && data !== null) {
    }
  });

  return {};
}
