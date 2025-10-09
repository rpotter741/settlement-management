import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { Genre } from '../../../../../../shared/types/index.js';
import batchGlossaryTermsThunk from '@/app/thunks/glossary/glossary/batchGlossaryTermsThunk.js';

export default function glossaryTermAutosaveConfig({
  id,
  genre,
  name,
}: {
  id: string;
  name?: string;
  genre: Genre;
}) {
  const dispatch: AppDispatch = useDispatch();
  const batchSaveFn = async () => {
    dispatch(
      batchGlossaryTermsThunk({
        id,
        genre,
      })
    );
  };

  return {
    name,
    batchSaveFn,
    intervalMs: 5000, // 5 seconds default
  };
}
