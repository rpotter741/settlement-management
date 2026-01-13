import { selectGlossaryNodes } from '@/app/selectors/glossarySelectors.js';
import {
  GlossaryEntryType,
  GlossaryNode,
  UUID,
} from '../../../../shared/types/index.js';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';

let cache: Record<string, string[]> | null = null;
let lastAccessed: number = 0;
const cacheTTL = 5 * 60 * 10000; // 5 minutes

function getCache(nodes: GlossaryNode[]): Record<GlossaryEntryType, UUID[]> {
  const now = Date.now();

  if (cache && now - lastAccessed < cacheTTL) {
    lastAccessed = now;
    return cache;
  }

  // build the map baby!
  cache = nodes.reduce(
    (acc, entry) => {
      if (!acc[entry.entryType]) {
        acc[entry.entryType] = [];
      }
      acc[entry.entryType].push(entry.id);
      return acc;
    },
    {} as Record<GlossaryEntryType, UUID[]>
  );
  lastAccessed = now;
  return cache;
}

function addEntry(entryId: UUID, entryType: GlossaryEntryType) {
  if (!cache) {
    cache = {};
  }
  if (!cache[entryType]) {
    cache[entryType] = [];
  }
  cache[entryType].push(entryId);
  lastAccessed = Date.now();
}

function updateCacheType(
  entryId: UUID,
  oldType: GlossaryEntryType,
  newType: GlossaryEntryType
) {
  if (!cache) {
    return;
  }
  // remove from old type
  if (cache[oldType]) {
    cache[oldType] = cache[oldType].filter((id) => id !== entryId);
  }
  // add to new type
  if (!cache[newType]) {
    cache[newType] = [];
  }
  cache[newType].push(entryId);
  lastAccessed = Date.now();
}

function removeEntry(entryId: UUID, entryType: GlossaryEntryType) {
  if (!cache || !cache[entryType]) {
    return;
  }
  cache[entryType] = cache[entryType].filter((id) => id !== entryId);
  lastAccessed = Date.now();
}

function invalidateCache() {
  cache = null;
  lastAccessed = 0;
}

function keepAlive() {
  lastAccessed = Date.now();
}

export default function useEntriesByType(glossaryId: string) {
  const nodes = useSelector(selectGlossaryNodes(glossaryId));

  useEffect(() => {
    const interval = setInterval(keepAlive, 240000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(
    () => ({
      byTypeCache: () => getCache(Object.values(nodes)),
      addEntry: (entryId: UUID, entryType: GlossaryEntryType) =>
        addEntry(entryId, entryType),
      updateCacheType: (
        entryId: UUID,
        oldType: GlossaryEntryType,
        newType: GlossaryEntryType
      ) => updateCacheType(entryId, oldType, newType),
      removeEntry: (entryId: UUID, entryType: GlossaryEntryType) =>
        removeEntry(entryId, entryType),
      invalidateCache: () => invalidateCache(),
    }),
    [nodes]
  );
}
