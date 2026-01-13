import { useEffect, useRef, useCallback } from 'react';
import useSharedHooks from '../useSharedHooks.js';
import { get, isEqual } from 'lodash';
import { GenericObject } from '../../../../../shared/types/common.js';
import { useSelector } from 'react-redux';

export type SaveTarget<T> = {
  id: string; // glossary-entry id (shared)
  label: string; // pretty name for snackbar
  keypath: keyof T | string;
};

export function useAutosave<T extends object>({
  name,
  batchSaveFn,
  intervalMs = 60000, // 1 minute default
}: {
  name?: string;
  batchSaveFn: () => Promise<void>;
  intervalMs?: number;
}) {
  /* ---------------- Hooks ---------------- */

  const isSavingRef = useRef(false);
  const lastFailedMap = useRef<Record<string, number>>({});
  const { snackbar } = useSharedHooks().utils;

  /* ---------------- initialize target failures ---------------- */

  const runSave = useCallback(
    async (flushing: boolean) => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      await batchSaveFn();

      if (flushing) {
      }

      isSavingRef.current = false;
    },
    [batchSaveFn, snackbar]
  );

  useEffect(() => {
    const id = setInterval(() => runSave(false), intervalMs);
    return () => clearInterval(id);
  }, [runSave, intervalMs]);

  useEffect(() => {
    return () => {
      if (!isSavingRef.current) {
        runSave(true);
      }
    };
  }, []);
}
