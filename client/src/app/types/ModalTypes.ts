import { ModalKey } from '@/maps/modalMap.js';
import React from 'react';

export interface ModalQueueEntry {
  component?: React.ComponentType<any>;
  componentKey?: ModalKey;
  props?: Record<string, any>;
  positionSx?: Record<string, any>;
  id: string;
  disableBackgroundClose?: boolean;
  onClose?: () => void;
}

export interface ModalState {
  open: boolean;
  currentModal: React.ComponentType<any> | null;
  currentModalKey?: ModalKey | null;
  currentModalId?: string | null;
  positionSx?: Record<string, any>;
  props: Record<string, any>;
  queue: Array<ModalQueueEntry>;
  disableBackgroundClose?: boolean;
  nextCloseFn?: () => void;
}
