import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { Genre } from '@/components/shared/Metadata/GenreSelect.js';
import batchGlossaryTermsThunk from '@/app/thunks/glossary/glossary/batchGlossaryTermsThunk.js';

export default function glossaryTermAutosaveConfig({
  id,
  tabId,
  genre,
  name,
}: {
  id: string;
  tabId: string;
  name?: string;
  genre: Genre;
}) {
  const dispatch: AppDispatch = useDispatch();
  const batchSaveFn = async () => {
    dispatch(
      batchGlossaryTermsThunk({
        id,
        genre,
        tabId,
      })
    );
  };

  return {
    name,
    batchSaveFn,
    intervalMs: 5000, // 5 seconds default
  };
}
