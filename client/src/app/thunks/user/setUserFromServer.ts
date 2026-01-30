import { setError, setUser } from '@/app/slice/userSlice.js';
import { RootState } from '@/app/store.js';
import api from '@/services/interceptor.js';
import { ThunkDispatch } from 'redux-thunk';

export default function setUserFromServer() {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const response = await api.get('/api/user');
      dispatch(setUser(response.data));
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Error setting user from server:', error);
      dispatch(setError(error.message));
    }
  };
}
