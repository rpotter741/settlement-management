import { selectGlossaryNodes } from '@/app/selectors/glossarySelectors.js';
import {
  GlossaryEntryType,
  GlossaryNode,
  UUID,
} from '../../../../shared/types/index.js';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';

let cache: Record<UUID, GlossaryEntryType> | null = null;
let lastAccessed: number = 0;
const cacheTTL = 5 * 60 * 10000; // 5 minutes

function getCache(nodes: GlossaryNode[]): Record<UUID, GlossaryEntryType> {
  const now = Date.now();

  if (cache && now - lastAccessed < cacheTTL) {
    lastAccessed = now;
    return cache;
  }

  // build the map baby!
  cache = nodes.reduce(
    (acc, node) => {
      if (!acc[node.id]) {
        acc[node.id] = node.entryType;
      }
      return acc;
    },
    {} as Record<UUID, GlossaryEntryType>
  );
  lastAccessed = now;
  return cache;
}

function addEntry(entryId: UUID, entryType: GlossaryEntryType) {
  if (!cache) {
    cache = {};
  }
  cache[entryId] = entryType;
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
  if (cache[entryId]) {
    cache[entryId] = newType;
    lastAccessed = Date.now();
  }
}

function removeEntry(entryId: UUID, entryType: GlossaryEntryType) {
  if (!cache || !cache[entryId]) {
    return;
  }
  delete cache[entryId];
  lastAccessed = Date.now();
}

function invalidateCache() {
  cache = null;
  lastAccessed = 0;
}

function keepAlive() {
  lastAccessed = Date.now();
}

export default function useTypesByIds(glossaryId: string) {
  const nodes = useSelector(selectGlossaryNodes(glossaryId));

  useEffect(() => {
    const interval = setInterval(keepAlive, 240000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(
    () => ({
      nodes,
      byIdsCache: () => getCache(Object.values(nodes)),
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
