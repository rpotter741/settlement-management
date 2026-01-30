import store from '@/app/store.ts';
import { useMemo } from 'react';

const useUser = () => {
  const user = useMemo(() => {
    return store.getState().user;
  }, [store.getState().user]);
  return { user };
};

export default useUser;
