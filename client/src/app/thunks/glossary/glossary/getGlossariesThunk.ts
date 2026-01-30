import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import serverAction from '@/services/glossaryServices.js';
import { initializeGlossary } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import { addSubType } from '@/app/slice/subTypeSlice.js';
import { invoke } from '@tauri-apps/api/core';

export default function getGlossariesThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const existingGlossaries = getState().glossary.glossaries.edit.allIds;
      if (existingGlossaries.length > 0) {
        // Glossaries already exist in state, no need to fetch again
        return;
      }
      // const glossaries = await serverAction.getGlossaries();
      const glossaries: GlossaryStateEntry[] = await invoke('get_glossaries', {
        userId: 'robbiepottsdm',
      });
      const existingState = getState().glossary.glossaries.edit.byId;

      glossaries.forEach((glossary: GlossaryStateEntry) => {
        if (!existingState[glossary.id]) {
          glossary.subTypes?.forEach((subType: any) => {
            dispatch(addSubType({ subType }));
          });
          dispatch(
            initializeGlossary({
              glossaryId: glossary.id,
              name: glossary.name,
              description: glossary.description,
              genre: glossary.genre,
              // @ts-ignore
              subGenre: glossary.subGenre,
              integrationState: glossary.integrationState,
              theme: glossary.theme,
            })
          );
        }
      });
    } catch (error) {
      console.error('Error fetching glossaries:', error);
      dispatch(
        showSnackbar({
          message: 'Error fetching glossaries. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
