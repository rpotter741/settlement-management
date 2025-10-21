import { selectRelayById } from '@/app/selectors/relaySelectors.js';
import {
  updateRelay as update,
  addErrorMessage,
  initializeRelay,
  clearRelay,
  refreshRelay,
} from '@/app/slice/relaySlice.js';
import { AppDispatch } from '@/app/store.js';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { v4 as newId } from 'uuid';
import { GenericObject } from '../../../../shared/types/common.js';

export type RelayStatus = 'pending' | 'complete' | 'error';

export interface UseRelayReturn<T> {
  data: T | null;
  status: RelayStatus;
  isPending: boolean;
  isComplete: boolean;
  isError: boolean;
  closeRelay: () => void;
  refreshTTL: () => void;
}

export interface UseRelayPubReturn<T> {
  updateRelay: (data: T) => void;
  openRelay: (data?: T, status?: RelayStatus) => void; //reducer assigns null / 'pending' if not provided
  addError: (errorMessage: string) => void;
}

export function useRelayPub<T = unknown>({
  id,
}: {
  id: string;
}): UseRelayPubReturn<T> {
  const dispatch = useDispatch<AppDispatch>();

  const openRelay = (data?: T, status?: RelayStatus) => {
    dispatch(initializeRelay({ id, data, status }));
  };

  const updateRelay = (data: T) => {
    dispatch(update({ id, data }));
  };

  const addError = (errorMessage: string) => {
    dispatch(addErrorMessage({ id, errorMessage }));
  };

  return {
    openRelay,
    updateRelay,
    addError,
  };
}

export function useRelaySub<T = unknown>({
  id,
  onComplete,
  deps = [],
  removeAfterConsume = true,
}: {
  id: string;
  onComplete?: (data: T) => void;
  deps?: any[];
  removeAfterConsume?: boolean;
}): UseRelayReturn<T> {
  const dispatch = useDispatch<AppDispatch>();
  const relay = useSelector(selectRelayById(id));

  const data = (relay?.data as T) ?? null;
  const status: RelayStatus = relay?.status ?? 'pending';

  const closeRelay = () => {
    dispatch(clearRelay({ id }));
  };

  const refreshTTL = () => {
    dispatch(refreshRelay({ id }));
  };

  useEffect(() => {
    if (status === 'complete' && onComplete && data !== null) {
      onComplete(data);
      if (removeAfterConsume) closeRelay();
    }
  }, [status, data, onComplete, removeAfterConsume, ...deps]);

  return {
    data,
    status,
    isPending: status === 'pending',
    isComplete: status === 'complete',
    isError: status === 'error',
    closeRelay,
    refreshTTL,
  };
}

export const useRelayChannel = <T extends GenericObject>({
  id,
  onComplete,
  removeAfterConsume = true,
  deps = [],
}: {
  id: string;
  onComplete?: (data: T) => void;
  removeAfterConsume?: boolean;
  deps?: any[];
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const sourceId = useMemo(() => newId(), []);
  const relay = useSelector(selectRelayById(id));

  const data = (relay?.data as T) ?? null;
  const status: RelayStatus = relay?.status ?? 'pending';

  const openRelay = ({ data, status }: { data?: T; status?: RelayStatus }) => {
    if (status === 'pending') return; // Prevent reopening if already pending
    dispatch(
      initializeRelay({ id, data: { ...data, sourceId }, status, sourceId })
    );
  };

  const updateRelay = ({ data }: { data: T }) => {
    dispatch(update({ id, data: { ...data, sourceId }, sourceId }));
  };

  const addError = (errorMessage: string) => {
    dispatch(addErrorMessage({ id, errorMessage, sourceId }));
  };

  const closeRelay = () => {
    dispatch(clearRelay({ id }));
  };

  const refreshTTL = () => {
    dispatch(refreshRelay({ id }));
  };

  useEffect(() => {
    if (
      status === 'complete' &&
      onComplete &&
      data !== null &&
      data.sourceId !== sourceId
    ) {
      onComplete(data);
      if (removeAfterConsume) closeRelay();
    }
  }, [status, data, onComplete, removeAfterConsume, ...deps]);

  return useMemo(
    () => ({
      data,
      status,
      isPending: status === 'pending',
      isComplete: status === 'complete',
      isError: status === 'error',
      openRelay,
      updateRelay,
      addError,
      closeRelay,
      refreshTTL,
    }),
    [data, status, openRelay, updateRelay, addError, closeRelay, refreshTTL]
  );
};
