import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveGlossaryId } from '@/app/slice/glossarySlice.js';
import {
  selectActiveId,
  selectAllEditGlossaries,
  selectEditGlossaryById,
  selectGlossaryStructure,
} from '@/app/selectors/glossarySelectors.js';
import thunks from '@/app/thunks/glossaryThunks.js';

import { AppDispatch } from '@/app/store.js';
import { updateUIKey } from '@/app/slice/uiSlice.js';

const useGlossaryManager = () => {
  const dispatch: AppDispatch = useDispatch();
  const glossaryId = useSelector(selectActiveId());
  const glossaries = useSelector(selectAllEditGlossaries());
  const glossary = useSelector(selectEditGlossaryById(glossaryId || ''));

  const nodes = useSelector(selectGlossaryStructure(glossaryId || ''));

  useEffect(() => {
    dispatch(thunks.getGlossaries());
  }, []);

  useEffect(() => {
    if (glossaries.length > 0 && glossaryId === null) {
      const lastActiveId = localStorage.getItem('lastActiveGlossaryId');
      if (lastActiveId) {
        dispatch(setActiveGlossaryId({ glossaryId: lastActiveId }));
      }
    }
  }, [glossaries, glossaryId]);

  useEffect(() => {
    if (glossaryId !== null && nodes.length === 0) {
      dispatch(thunks.getNodes({ glossaryId }));
    }
  }, [glossaryId]);

  const handleSelect = (glossId: any) => {
    if (glossId === glossaryId) return;
    console.log('setting active id');
    dispatch(setActiveGlossaryId({ glossaryId: glossId }));
  };

  const deselectGlossary = () => {
    if (glossaryId === null) return;
    dispatch(
      updateUIKey({
        config: 'glossary',
        key: 'activeTab',
        value: 'Overview',
      })
    );
    dispatch(setActiveGlossaryId({ glossaryId: null }));
    localStorage.removeItem('lastActiveGlossaryId');
  };

  return {
    handleSelect,
    deselectGlossary,
    glossary,
    glossaries,
    glossaryId,
  };
};

export default useGlossaryManager;
