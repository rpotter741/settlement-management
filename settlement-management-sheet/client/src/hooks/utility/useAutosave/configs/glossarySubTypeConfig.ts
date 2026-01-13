import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import batchSubTypeDefinitionThunk from '@/app/thunks/glossary/subtypes/batchSubTypeDefinitionThunk.js';

export default function glossarySubTypeAutosaveConfig({
  subTypeId,
  name,
  intervalMs,
}: {
  subTypeId: string;
  name: string;
  intervalMs?: number;
}) {
  const dispatch: AppDispatch = useDispatch();
  const batchSaveFn = async () => {
    dispatch(
      batchSubTypeDefinitionThunk({
        id: subTypeId,
      })
    );
  };

  return {
    name,
    batchSaveFn,
    intervalMs: intervalMs || 5000, // 5 seconds default
  };
}
