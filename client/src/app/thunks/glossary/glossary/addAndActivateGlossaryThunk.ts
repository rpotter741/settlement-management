import { ThunkDispatch } from 'redux-thunk';
import { AppThunk } from '@/app/thunks/glossaryThunks.js';
import { RootState } from '@/app/store.js';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import {
  initializeGlossary,
  setActiveGlossaryId,
} from '@/app/slice/glossarySlice.js';

export default function addAndActivateGlossaryThunk({
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
    dispatch(
      initializeGlossary({
        glossaryId: id,
        name,
        description,
        genre,
        subGenre,
        integrationState: {},
        theme: 'default',
      })
    );
    dispatch(setActiveGlossaryId({ glossaryId: id }));
  };
}
