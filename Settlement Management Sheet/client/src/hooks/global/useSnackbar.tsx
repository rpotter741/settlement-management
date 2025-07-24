import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';

const useSnackbar = () => {
  const dispatch: AppDispatch = useDispatch();

  const makeSnackbar = ({
    message,
    type,
    duration = 3000,
  }: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }) => {
    dispatch(showSnackbar({ message, type, duration }));
  };

  return { makeSnackbar };
};

export default useSnackbar;
