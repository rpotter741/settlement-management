import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';

export default function consumeRelayThunk({ id }: { id: string }): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>, getState) => {
    try {
      const state = getState();
      const relay = state.relay.relays[id];
      if (relay) {
        // Process the relay data
      }
    } catch (error) {
      console.error('Error consuming relay:', error);
    }
  };
}
