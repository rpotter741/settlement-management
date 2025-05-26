import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { RootState } from '../../../app/store';
import { GlossaryState, GlossaryStateEntry } from './types';
import { GlossaryNode } from '../../../../../types';

const base = (state: RootState): GlossaryState => state.glossary;

export const selectAllGlossaries = () =>
  createSelector(base, (glossaryState: GlossaryState) => {
    const glossaries = glossaryState.glossaries;
    const glossariesArray = Object.entries(glossaries).map(
      ([id, { name, description }]: [string, GlossaryStateEntry]) => ({
        id,
        name,
        description,
      })
    );
    return glossariesArray;
  });

export const selectGlossaryById = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries[glossaryId] || null
  );

export const selectNodeById = (glossaryId: string, nodeId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries[glossaryId]?.nodes[nodeId] || null
  );

export const nodeRenderState = (glossaryId: string | null, nodeId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      (glossaryId &&
        glossaryState.glossaries[glossaryId]?.renderState[nodeId]) || {
        expanded: false,
        rename: false,
      }
  );

export const selectGlossaryStructure = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries[glossaryId]?.structure || []
  );

export const selectGlossaryNodes = (glossaryId: string) =>
  createSelector(
    base,
    (glossaryState: GlossaryState) =>
      glossaryState.glossaries[glossaryId]?.nodes || {}
  );

export const selectActiveId = () =>
  createSelector(
    base,
    (glossaryState: GlossaryState) => glossaryState.activeGlossaryId || null
  );

export const selectSnackbar = () =>
  createSelector(
    base,
    (glossaryState: GlossaryState) => glossaryState.snackbar || null
  );

export const selectors = {
  selectAllGlossaries,
  selectGlossaryById,
  selectNodeById,
  nodeRenderState,
  selectGlossaryStructure,
  selectGlossaryNodes,
  selectActiveId,
  selectSnackbar,
};
