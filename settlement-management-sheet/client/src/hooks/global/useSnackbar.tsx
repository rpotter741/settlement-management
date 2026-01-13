import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';

const useSnackbar = () => {
  const dispatch: AppDispatch = useDispatch();

  const makeSnackbar = ({
    message,
    type,
    duration = 3000,
    componentKey,
    props,
  }: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    componentKey?: string;
    props?: Record<string, any>;
  }) => {
    dispatch(showSnackbar({ message, type, duration, componentKey, props }));
  };

  return { makeSnackbar };
};

export default useSnackbar;
