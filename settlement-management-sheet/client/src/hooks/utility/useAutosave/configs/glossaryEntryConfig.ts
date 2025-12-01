import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import batchUpdateEntry from '@/app/thunks/glossary/entries/batchUpdateEntry.js';
import { SubModelType } from '../../../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';

export default function glossaryEntryAutosaveConfig({
  glossaryId,
  entryId,
  subTypeId,
  name,
}: {
  glossaryId: string;
  entryId: string;
  subTypeId: string;
  name: string;
}) {
  const batchSaveFn = async () => {
    dispatch(batchUpdateEntry({ glossaryId, entryId, subTypeId }));
  };

  return {
    name,
    batchSaveFn,
    intervalMs: 5000, // 5 seconds default
  };
}
