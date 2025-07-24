import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import * as actions from '@/app/slice/modalSlice.js';
import { ModalQueueEntry } from '@/app/types/ModalTypes.js';

export const useModalActions = () => {
  const dispatch = useDispatch();

  const showModal = useCallback(
    ({ entry }: { entry: ModalQueueEntry }) => {
      const { component, componentKey, props, positionSx, id } = entry;
      dispatch(
        actions.showModal({ component, componentKey, props, positionSx, id })
      );
    },
    [dispatch]
  );

  const closeModal = useCallback(
    (autoNext: boolean = false) => {
      dispatch(actions.closeModal({ autoNext }));
    },
    [dispatch]
  );

  const nextModal = useCallback(() => {
    dispatch(actions.processQueue());
  }, [dispatch]);

  const clearModals = useCallback(() => {
    dispatch(actions.clearQueue());
  }, [dispatch]);

  const setModalProps = useCallback(
    (newProps: Record<string, any>) => {
      dispatch(actions.setModalProps({ newProps }));
    },
    [dispatch]
  );

  const setPositionSx = useCallback(
    (positionSx: Record<string, any>) => {
      dispatch(actions.setPositionSx(positionSx));
    },
    [dispatch]
  );

  const resetPositionSx = useCallback(() => {
    dispatch(actions.resetPositionSx());
  }, [dispatch]);

  const disableBackgroundClose = useCallback(() => {
    dispatch(actions.disableBackgroundClose());
  }, [dispatch]);

  const enableBackgroundClose = useCallback(() => {
    dispatch(actions.enableBackgroundClose());
  }, [dispatch]);

  const loadQueue = useCallback(
    (queueEntries: Array<ModalQueueEntry>) => {
      dispatch(actions.loadQueue({ queueEntries }));
    },
    [dispatch]
  );

  return {
    showModal,
    closeModal,
    nextModal,
    clearModals,
    setModalProps,
    setPositionSx,
    resetPositionSx,
    disableBackgroundClose,
    enableBackgroundClose,
    loadQueue,
  };
};
