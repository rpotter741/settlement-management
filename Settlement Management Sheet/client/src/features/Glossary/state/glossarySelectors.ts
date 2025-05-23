import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { RootState } from '../../../app/store';
import { GlossaryState, GlossaryStateEntry } from './types';
import { GlossaryNode } from '../../../../../types';

export const selectGlossaryById = (glossaryId: string) =>
  createSelector(
    (state: RootState) => state.glossary.glossaries[glossaryId],
    (glossary) => glossary || null
  );

export const selectNodeById = (glossaryId: string, nodeId: string) =>
  createSelector(
    (state: RootState) => state.glossary.glossaries[glossaryId]?.nodes[nodeId],
    (node) => node || null
  );

export const isNodeExpanded = (glossaryId: string, nodeId: string) =>
  createSelector(
    (state: RootState) =>
      state.glossary.glossaries[glossaryId]?.expanded[nodeId],
    (isExpanded) => isExpanded || false
  );

export const selectGlossaryStructure = (glossaryId: string) =>
  createSelector(
    (state: RootState) => state.glossary.glossaries[glossaryId]?.structure,
    (structure) => structure || []
  );

export const selectGlossaryNodes = (glossaryId: string) =>
  createSelector(
    (state: RootState) => state.glossary.glossaries[glossaryId]?.nodes,
    (nodes) => nodes || {}
  );

export const selectActiveId = () =>
  createSelector(
    (state: RootState) => state.glossary.activeGlossaryId,
    (activeId) => activeId || null
  );

export const selectors = {
  selectGlossaryById,
  selectNodeById,
  isNodeExpanded,
  selectGlossaryStructure,
  selectGlossaryNodes,
  selectActiveId,
};
