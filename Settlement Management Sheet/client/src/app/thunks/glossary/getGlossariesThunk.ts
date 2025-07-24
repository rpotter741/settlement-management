import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '../../../services/glossaryServices.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import { initializeGlossary } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { Glossary } from 'types/index.js';

export default function getGlossariesThunk(): AppThunk {
  return async (dispatch, getState) => {
    try {
      const glossaries = await serverAction.getGlossaries();
      const existingState = getState().glossary.glossaries;

      glossaries.forEach((glossary: Glossary) => {
        if (!existingState[glossary.id]) {
          dispatch(
            initializeGlossary({
              glossaryId: glossary.id,
              name: glossary.name,
              description: glossary.description,
              genre: glossary.genre,
              // @ts-ignore
              subGenre: glossary.subGenre,
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
