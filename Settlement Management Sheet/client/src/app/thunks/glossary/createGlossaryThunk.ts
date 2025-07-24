import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '../glossaryThunks.js';
import { RootState } from '@/app/store.js';
import serverAction from '../../../services/glossaryServices.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import { initializeGlossary } from '@/app/slice/glossarySlice.js';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';

export default function createGlossaryThunk({
  id,
  name,
  description,
  genre,
  subGenre,
}: {
  id: string;
  name: string;
  description: {
    markdown: string;
    string: string;
  };
  genre: Genre;
  subGenre: string;
}): AppThunk {
  return async (dispatch: ThunkDispatch<RootState, unknown, any>) => {
    try {
      const glossary = await serverAction.createGlossary({
        id,
        name,
        description,
        genre,
        subGenre,
      });
      dispatch(
        initializeGlossary({
          glossaryId: glossary.id,
          name: glossary.name,
          description: glossary.description,
          genre: glossary.genre,
          subGenre: glossary.subGenre,
        })
      );
    } catch (error) {
      console.error('Error creating glossary:', error);
      dispatch(
        showSnackbar({
          message: 'Error creating glossary. Try again later.',
          type: 'error',
          duration: 3000,
        })
      );
    }
  };
}
