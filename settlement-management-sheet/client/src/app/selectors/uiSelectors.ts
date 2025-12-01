import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store.js';

const base = (state: RootState) => state.ui;

export const selectGlossaryUI = () =>
  createSelector(base, (uiState) => {
    return uiState.glossary;
  });

export const selectEventUI = () =>
  createSelector(base, (uiState) => {
    return uiState.event;
  });

export const selectStoryThreadUI = () =>
  createSelector(base, (uiState) => {
    return uiState.storyThread;
  });

export const selectAptUI = () =>
  createSelector(base, (uiState) => {
    return uiState.apt;
  });

export const selectActiveTab = (config: keyof ReturnType<typeof base>) =>
  createSelector(base, (uiState: ReturnType<typeof base>) => {
    return uiState[config]?.activeTab || 'Overview';
  });
