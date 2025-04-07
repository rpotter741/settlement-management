import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]); // Queue of toasts
  const [currentSnackbar, setCurrentSnackbar] = useState(null); // Active toast

  // Add a new toast to the queue
  const showSnackbar = useCallback(
    (message, type = 'info', duration = 3000, component = null, props = {}) => {
      setQueue((prevQueue) => [
        ...prevQueue,
        { id: Date.now(), message, type, duration, component, props },
      ]);
    },
    []
  );

  // Process the next toast in the queue
  const processQueue = useCallback(() => {
    if (queue.length > 0) {
      const [nextToast, ...remainingQueue] = queue;
      setQueue(remainingQueue);
      setCurrentSnackbar(nextToast);
    } else {
      setCurrentSnackbar(null); // No more toasts to show
    }
  }, [queue]);

  // Automatically process the next toast when the current one is dismissed
  const closeSnackbar = useCallback(() => {
    setCurrentSnackbar((prev) => ({ ...prev, open: false }));
    setTimeout(processQueue, 300); // Delay to allow the fade-out animation
  }, [processQueue]);

  // Trigger the next toast when none is active
  useEffect(() => {
    if (!currentSnackbar && queue.length > 0) {
      processQueue();
    }
  }, [currentSnackbar, queue, processQueue]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, closeSnackbar }}>
      {children}
      {currentSnackbar && (
        <Snackbar
          key={currentSnackbar.id}
          open={currentSnackbar.open !== false} // Avoid immediate dismissal on rerender
          autoHideDuration={currentSnackbar.duration}
          onClose={(event, reason) => {
            if (reason === 'clickaway') {
              return;
            }
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
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
