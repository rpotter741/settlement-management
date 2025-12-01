import {
  selectActiveId,
  selectAllEditGlossaries,
  selectEditGlossaryById,
  selectEditThemeById,
  selectStaticGlossaryById,
  selectStaticThemeById,
} from '@/app/selectors/glossarySelectors.js';
import { selectGlossaryUI } from '@/app/selectors/uiSelectors.js';
import {
  resetPalette,
  savePalette,
  updatePalette,
} from '@/app/slice/glossarySlice.js';
import {
  updateConfigTab,
  updateLastTab,
  updateUIKey,
} from '@/app/slice/uiSlice.js';
import { AppDispatch } from '@/app/store.js';
import updateGlossaryThunk from '@/app/thunks/glossary/glossary/updateGlossaryThunk.js';
import {
  defaultThemeState,
  ThemeKeys,
} from '@/features/Glossary/EditGlossary/Palette/CustomizePalette.js';
import { useTheme } from '@emotion/react';
import { cloneDeep } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import useSnackbar from '../global/useSnackbar.js';
import { useSidebarContext } from '@/context/SidePanel/SidePanelContext.js';

const useGlossaryEditor = () => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();

  const activeId = useSelector(selectActiveId());
  const glossary = useSelector(selectEditGlossaryById(activeId || ''));
  const staticTheme = useSelector(selectStaticThemeById(activeId || ''));
  const editTheme = useSelector(selectEditThemeById(activeId || ''));
  const referenceGlossary = useSelector(
    selectStaticGlossaryById(activeId || '')
  );
  const glossaries = useSelector(selectAllEditGlossaries());
  const ui = useSelector(selectGlossaryUI());

  const { makeSnackbar } = useSnackbar();

  function preventUnsavedPaletteChanges() {
    if (ui.activeTab === 'Palette') {
      if (glossary.theme !== referenceGlossary.theme) {
        return true;
      }
    }
    return false;
  }

  const updateActiveTab = (activeTab: string) => {
    if (preventUnsavedPaletteChanges()) {
      makeSnackbar({
        message:
          'Please save or reset your palette changes before leaving the tab.',
        type: 'warning',
      });
      return;
    }
    dispatch(updateLastTab({ config: 'glossary', lastTab: ui.activeTab }));
    dispatch(updateConfigTab({ config: 'glossary', activeTab }));
  };

  const updateGlossary = (keypath: string, value: any) => {
    dispatch(
      updateGlossaryThunk({ id: glossary.id, updates: { [keypath]: value } })
    );
  };

  const updatePaletteColor = ({
    themeKey,
    shade,
    color,
  }: {
    themeKey: ThemeKeys;
    shade: 'light' | 'main' | 'dark' | 'default' | 'paper';
    color: string;
  }) => {
    if (!activeId) return;
    //@ts-ignore
    const mode = theme.palette.mode as 'light' | 'dark';
    const shallowCopy =
      typeof glossary.theme === 'object' && glossary.theme[mode] !== undefined
        ? null
        : cloneDeep(defaultThemeState(theme));
    dispatch(
      updatePalette({
        themeKey,
        shade,
        color,
        glossaryId: activeId,
        mode,
        defaultTheme: shallowCopy,
      })
    );
  };

  const resetPaletteToDefault = () => {
    dispatch(resetPalette({ glossaryId: activeId || '' }));
  };

  const savePaletteSettings = () => {
    dispatch(savePalette({ glossaryId: activeId || '' }));
  };

  const updateUI = ({ key, value }: { key: string; value: any }) => {
    dispatch(updateUIKey({ config: 'glossary', key, value }));
  };

  return {
    activeId: activeId || '',
    glossary,
    glossaries,
    ui,
    staticTheme,
    editTheme,
    updateActiveTab,
    updateGlossary,
    updateUI,
    updatePaletteColor,
    resetPaletteToDefault,
    savePaletteSettings,
  };
};

export default useGlossaryEditor;
