import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnackbarContext = createContext();

const SnackbarRenderer = React.memo(({ currentSnackbar, closeSnackbar }) => {
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
});

export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentSnackbar, setCurrentSnackbar] = useState(null);

  const showSnackbar = useCallback(
    (message, type = 'info', duration = 3000, component = null, props = {}) => {
      setQueue((prevQueue) => [
        ...prevQueue,
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
    setCurrentSnackbar((prev) => ({ ...prev, open: false }));
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
      {ReactDOM.createPortal(
        <SnackbarRenderer
          currentSnackbar={currentSnackbar}
          closeSnackbar={closeSnackbar}
        />,
        document.getElementById('portal-root')
      )}
    </>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
