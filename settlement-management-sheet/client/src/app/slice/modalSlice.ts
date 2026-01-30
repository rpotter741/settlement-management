import { modalMap } from '@/maps/modalMap.js';
import { ModalQueueEntry, ModalState } from '../types/ModalTypes.js';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ulid as newId } from 'ulid';

export const initialState: ModalState = {
  open: false,
  currentModal: null,
  currentModalKey: null,
  currentModalId: null,
  props: {},
  queue: [],
  positionSx: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'background.default',
    border: '2px solid #000',
    borderColor: 'secondary.light',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    boxSizing: 'border-box',
    minWidth: '50%',
  },
  disableBackgroundClose: false,
  nextCloseFn: undefined,
};

function hydrateModal(state: ModalState, item: ModalQueueEntry): void {
  state.currentModal = item.component || null;
  state.currentModalKey = item.componentKey || null;
  state.props = item.props || {};
  state.positionSx = item.positionSx || initialState.positionSx;
  state.disableBackgroundClose = item.disableBackgroundClose || false;
  state.currentModalId = item.id;
  state.nextCloseFn = item.onClose;
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{
        component?: React.ComponentType<any>;
        componentKey?: string;
        props?: Record<string, any>;
        positionSx?: Record<string, any>;
        id?: string;
        onClose?: () => void;
      }>
    ) => {
      const {
        component,
        componentKey,
        props = {},
        positionSx = initialState.positionSx,
        id = newId(),
        onClose,
      } = action.payload;
      state.queue.push({
        component,
        componentKey,
        props,
        positionSx,
        id,
        onClose,
      });
      if (!state.open) {
        state.open = true;
      }
      const nextItem = state.queue.shift();
      if (nextItem) {
        hydrateModal(state, nextItem);
      }
    },
    closeModal: (state, action: PayloadAction<{ autoNext?: boolean }>) => {
      state.open = false;
      state.currentModal = null;
      state.currentModalId = null;
      state.props = {};
      if (state.nextCloseFn) {
        state.nextCloseFn();
        state.nextCloseFn = undefined;
      }
      if (action.payload?.autoNext && state.queue.length > 0) {
        const nextItem = state.queue.shift();
        if (nextItem) {
          hydrateModal(state, nextItem);
        }
      }
    },
    loadQueue: (
      state,
      action: PayloadAction<{
        queueEntries: Array<ModalQueueEntry>;
      }>
    ) => {
      const { queueEntries = [] } = action.payload;
      state.queue = state.queue.concat(queueEntries);
    },
    processQueue: (state) => {
      if (state.queue.length > 0) {
        if (!state.open) {
          state.open = true;
        }
        const nextItem = state.queue.shift();
        if (nextItem) {
          hydrateModal(state, nextItem);
        }
      } else {
        state.open = false;
        state.currentModal = null;
        state.props = {};
      }
    },
    clearQueue: (state) => {
      state.queue = [];
      state.open = false;
      state.currentModal = null;
      state.currentModalId = null;
      state.props = {};
      state.positionSx = initialState.positionSx;
      state.disableBackgroundClose = false;
      state.nextCloseFn = undefined;
    },
    setPositionSx: (state, action: PayloadAction<Record<string, any>>) => {
      state.positionSx = action.payload;
    },
    setModalProps: (state, action: PayloadAction<Record<string, any>>) => {
      const { newProps } = action.payload;
      state.props = { ...state.props, ...newProps };
    },
    resetPositionSx: (state) => {
      state.positionSx = initialState.positionSx;
    },
    disableBackgroundClose: (state) => {
      state.disableBackgroundClose = true;
    },
    enableBackgroundClose: (state) => {
      state.disableBackgroundClose = false;
    },
  },
});

export const {
  showModal,
  closeModal,
  processQueue,
  clearQueue,
  setModalProps,
  setPositionSx,
  resetPositionSx,
  enableBackgroundClose,
  disableBackgroundClose,
  loadQueue,
} = modalSlice.actions;
export default modalSlice.reducer;
