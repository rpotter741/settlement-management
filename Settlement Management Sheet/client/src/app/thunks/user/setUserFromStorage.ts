import { setUser } from '@/app/slice/userSlice.js';
import { RootState } from '@/app/store.js';
import { ThunkDispatch } from 'redux-thunk';

export default function setUserFromStorage() {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        dispatch(setUser(JSON.parse(user)));
      }
    } catch (err) {
      console.warn('Invalid user data in storage, clearing...');
      localStorage.removeItem('user');
    }
  };
}
