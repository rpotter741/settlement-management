export type SnackbarType = 'success' | 'error' | 'warning' | 'info';
export interface SnackbarOptions {
  id: number;
  message: string;
  type: SnackbarType;
  duration: number;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
  open?: boolean;
}

export interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number,
    component?: React.ComponentType<any>,
    props?: Record<string, any>
  ) => void;
  closeSnackbar: () => void;
}

export type SnackbarQueueItem = {
  message: string;
  type: SnackbarType;
  duration: number;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
};

export interface SnackbarState {
  open: boolean;
  currentSnackbar: SnackbarQueueItem | null;
  queue: SnackbarQueueItem[];
}
