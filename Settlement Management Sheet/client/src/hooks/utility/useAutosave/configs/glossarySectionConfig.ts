import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import batchUpdateSubModelThunk from '@/app/thunks/glossary/entries/batchUpdateSubModel.js';
import { SubModelType } from '../../../../../../shared/types/index.js';

export default function glossarySectionAutosaveConfig({
  glossaryId,
  subModel,
  entryId,
  tabId,
  name,
}: {
  glossaryId: string;
  subModel: SubModelType;
  entryId: string;
  tabId: string;
  name: string;
}) {
  const dispatch: AppDispatch = useDispatch();
  const batchSaveFn = async () => {
    dispatch(
      batchUpdateSubModelThunk({
        glossaryId,
        subModel,
        entryId,
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
