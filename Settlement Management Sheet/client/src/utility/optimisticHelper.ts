import { AppDispatch } from '@/app/store.js';

/**
 * Standardized optimistic update helper.
 */
export async function optimisticHelper<T>({
  data,
  dispatch,
  localUpdate,
  serverAction,
  rollback,
}: {
  data: T;
  dispatch: AppDispatch;
  localUpdate: (payload: T) => any;
  serverAction: (payload: T) => Promise<any>;
  rollback: (payload: T) => any;
}) {
  dispatch(localUpdate(data));
  try {
    await serverAction(data);
  } catch (error) {
    console.error('Optimistic update failed:', error);
    dispatch(rollback(data));
  }
}
