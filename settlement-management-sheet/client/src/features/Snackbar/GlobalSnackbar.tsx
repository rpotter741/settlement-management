import { Snackbar, Alert, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useEffect, useCallback, useMemo, lazy, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  currentSnackbar as current,
  isOpen,
  queue,
  hasQueue,
} from '@/app/selectors/snackbarSelectors.js';

import { createPortal } from 'react-dom';
import { AppDispatch } from '@/app/store.js';
import {
  SnackbarOptions,
  SnackbarQueueItem,
} from '@/app/types/SnackbarTypes.js';
import { closeSnackbar, processQueue } from '@/app/slice/snackbarSlice.js';

const snackbarComponent = memo(
  ({
    currentSnackbar,
    closeSnackbar,
    open,
  }: {
    currentSnackbar: SnackbarQueueItem;
    closeSnackbar: () => void;
    open: boolean;
  }) => {
    const theme = useTheme();
    return (
      <Snackbar
        key={currentSnackbar.message}
        open={open} // Avoid immediate dismissal on rerender
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

const GlobalSnackbar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentSnackbar = useSelector(current);
  const open = useSelector(isOpen);
  const hasQueueItems = useSelector(hasQueue);

  useEffect(() => {
    if (hasQueueItems && !open) {
      dispatch(processQueue());
    }
  }, [hasQueueItems, open, dispatch]);

  if (currentSnackbar && open) {
    const portalRoot = document.getElementById('portal-root');
    return portalRoot
      ? createPortal(
          React.createElement(snackbarComponent, {
            currentSnackbar,
            closeSnackbar: () => {
              dispatch(closeSnackbar());
            },
            open,
          }),
          portalRoot
        )
      : null;
  }
  return null;
};

export default memo(GlobalSnackbar);
