import { Middleware } from '@reduxjs/toolkit';
import {
  initializeRelay,
  updateRelay,
  clearRelay,
  refreshRelay,
} from '@/app/slice/relaySlice.js';

const relayTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const relayTimerMiddleware =
  (): Middleware => (store) => (next) => (action) => {
    const result = next(action);

    if (initializeRelay.match(action)) {
      const { id, ttl } = action.payload;

      // Clear existing timer if present
      if (relayTimers.has(id)) clearTimeout(relayTimers.get(id)!);
      // Set new timer
      const timer = setTimeout(() => {
        store.dispatch(clearRelay({ id }));
        relayTimers.delete(id);
      }, ttl);

      relayTimers.set(id, timer);
    }

    // Refresh timer on demand
    if (refreshRelay.match(action)) {
      const { id } = action.payload;
      // Reset timer on refresh
      if (relayTimers.has(id)) {
        clearTimeout(relayTimers.get(id)!);
        const relay = store.getState().relay.relays[id];
        const timer = setTimeout(() => {
          store.dispatch(clearRelay({ id }));
          relayTimers.delete(id);
        }, relay.ttl);
        relayTimers.set(id, timer);
      }
    }

    // Cancel TTL if relay is cleared manually
    if (clearRelay.match(action)) {
      const { id } = action.payload;
      if (relayTimers.has(id)) {
        clearTimeout(relayTimers.get(id)!);
        relayTimers.delete(id);
      }
    }

    return result;
  };
