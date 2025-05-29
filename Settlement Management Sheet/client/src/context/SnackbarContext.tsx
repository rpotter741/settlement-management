import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  memo,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Snackbar, Alert } from '@mui/material';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarOptions {
  id: number;
  message: string;
  type: SnackbarType;
  duration: number;
  component?: React.ComponentType<any>;
  props?: Record<string, any>;
  open?: boolean;
}

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    type?: SnackbarType,
    duration?: number,
    component?: React.ComponentType<any>,
    props?: Record<string, any>
  ) => void;
  closeSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined
);

const SnackbarRenderer = memo(
  ({
    currentSnackbar,
    closeSnackbar,
  }: {
    currentSnackbar: SnackbarOptions;
    closeSnackbar: () => void;
  }) => {
    if (!currentSnackbar) return null;
    return (
      <Snackbar
        key={currentSnackbar.id}
        open={currentSnackbar.open !== false} // Avoid immediate dismissal on rerender
        autoHideDuration={currentSnackbar.duration}
        onClose={(event, reason) => {
          if (reason === 'clickaway') return;
          closeSnackbar();
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {currentSnackbar.component ? (
          <currentSnackbar.component {...currentSnackbar.props} />
        ) : (
          <Alert onClose={closeSnackbar} severity={currentSnackbar.type}>
            {currentSnackbar.message}
          </Alert>
        )}
      </Snackbar>
    );
  }
);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [queue, setQueue] = useState<SnackbarOptions[]>([]);
  const [currentSnackbar, setCurrentSnackbar] =
    useState<SnackbarOptions | null>(null);

  const showSnackbar = useCallback(
    (
      message: string,
      type: SnackbarType = 'info',
      duration: number = 3000,
      component?: React.ComponentType<any>,
      props: Record<string, any> = {}
    ) => {
      setQueue((prev) => [
        ...prev,
        { id: Date.now(), message, type, duration, component, props },
      ]);
    },
    []
  );

  const processQueue = useCallback(() => {
    if (queue.length > 0) {
      const [nextToast, ...remainingQueue] = queue;
      setQueue(remainingQueue);
      setCurrentSnackbar(nextToast);
    } else {
      setCurrentSnackbar(null);
    }
  }, [queue]);

  const closeSnackbar = useCallback(() => {
    setCurrentSnackbar((prev) => (prev ? { ...prev, open: false } : null));
    setTimeout(processQueue, 300);
  }, [processQueue]);

  useEffect(() => {
    if (!currentSnackbar && queue.length > 0) {
      processQueue();
    }
  }, [currentSnackbar, queue, processQueue]);

  const contextValue = useMemo(
    () => ({ showSnackbar, closeSnackbar }),
    [showSnackbar, closeSnackbar]
  );

  return (
    <>
      <SnackbarContext.Provider value={contextValue}>
        {children}
      </SnackbarContext.Provider>
      {currentSnackbar &&
        (() => {
          const portalRoot = document.getElementById('portal-root');
          return portalRoot
            ? createPortal(
                <SnackbarRenderer
                  currentSnackbar={currentSnackbar}
                  closeSnackbar={closeSnackbar}
                />,
                portalRoot
              )
            : null;
        })()}
    </>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
