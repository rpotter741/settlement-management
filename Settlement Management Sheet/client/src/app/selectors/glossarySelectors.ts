import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';
import { GlossaryState, GlossaryStateEntry } from '../types/GlossaryTypes.js';
import { GlossaryEntry, GlossaryNode } from 'types/index.js';
import { rehydrateGlossaryTree } from '@/features/Glossary/utils/rehydrateGlossary.js';

const base = (state: RootState): GlossaryState => state.glossary;

export const selectAllStaticGlossaries = () =>
  createSelector(base, (glossaryState: GlossaryState) => {
    const glossaries = glossaryState.glossaries.static.byId;
    const glossariesArray = Object.entries(glossaries).map(
      ([id, { name, description }]: [string, GlossaryStateEntry]) => ({
        id,
        name,
        description,
      })
    );
    return glossariesArray;
  });

export const selectAllEditGlossaries = () =>
  createSelector(base, (glossaryState: GlossaryState) => {
    const glossaries = glossaryState.glossaries.edit.byId;
    const glossariesArray = Object.entries(glossaries).map(
      ([id, { name, description }]: [string, GlossaryStateEntry]) => ({
        id,
        name,
        description,
      })
    );
    return glossariesArray;
  });

export const selectStaticGlossaryById = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.static.byId[glossaryId] || null
  );

export const selectEditGlossaryById = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId] || null
  );

export const selectEditThemeById = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId]?.theme || null
  );

export const selectStaticThemeById = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.static.byId[glossaryId]?.theme || null
  );

export const selectEditNodeById = (glossaryId: string, nodeId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId]?.nodes[nodeId] || null
  );

export const selectStaticNodeById = (glossaryId: string, nodeId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.static.byId[glossaryId]?.nodes[nodeId] || null
  );

export const selectEditEntryById = (glossaryId: string, entryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId]?.entries[entryId] || null
  );

export const selectStaticEntryById = (glossaryId: string, entryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.static.byId[glossaryId]?.entries[entryId] || null
  );

export const glossaryRenderState = (glossaryId: string | null) =>
  createSelector(base, (glossaryState: GlossaryState) =>
    glossaryId
      ? glossaryState.glossaries.edit.byId[glossaryId]?.renderState
      : null
  );

export const nodeRenderState = (glossaryId: string | null, nodeId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      (glossaryId &&
        glossaryState.glossaries.edit.byId[glossaryId]?.renderState[
          nodeId
        ]) || {
        expanded: false,
        rename: false,
      }
  );

export const selectGlossaryStructure = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId]?.structure || []
  );

export const selectGlossaryNodes = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId]?.nodes || {}
  );

export const selectGlossaryTree = (glossaryId: string) =>
  createSelector(base, (glossaryState: GlossaryState) => {
    const glossary = glossaryState.glossaries.edit.byId[glossaryId];
    if (!glossary) return { roots: [], nodeMap: {} };
    const { structure, renderState } = glossary;
    const { roots, nodeMap } = rehydrateGlossaryTree(structure, renderState);
    return { roots, nodeMap };
  });

export const selectSubTypeById = (glossaryId: string, subTypeId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries.edit.byId[glossaryId]?.templates?.[subTypeId] ||
      null
  );

export const selectActiveId = () =>
  createSelector(
    base,
    (glossaryState: GlossaryState) => glossaryState.activeGlossaryId || null
  );

export const selectKeypathOptions = (
  glossaryId: string,
  entryId: string,
  keypath: keyof GlossaryEntry
) =>
  createSelector(base, (glossaryState: GlossaryState) => {
    const glossary = glossaryState.glossaries.edit.byId[glossaryId];
    if (!glossary) return null;
    const options = glossary.options[entryId];
    if (!options) return null;
    return options[keypath] || null;
  });

export const selectors = {
  selectAllStaticGlossaries,
  selectAllEditGlossaries,
  selectStaticGlossaryById,
  selectEditGlossaryById,
  selectEditNodeById,
  selectStaticNodeById,
  selectEditEntryById,
  selectStaticEntryById,
  glossaryRenderState,
  nodeRenderState,
  selectGlossaryStructure,
  selectGlossaryNodes,
  selectActiveId,
  selectKeypathOptions,
  selectEditThemeById,
  selectStaticThemeById,
  selectGlossaryTree,
  selectSubTypeById,
};
