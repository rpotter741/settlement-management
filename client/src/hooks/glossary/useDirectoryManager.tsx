import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveGlossaryId,
  setGlossaryNodes,
} from '@/app/slice/glossarySlice.js';
import {
  selectActiveId,
  selectAllEditGlossaries,
  selectGlossaryStructure,
  selectGlossaryTree,
} from '@/app/selectors/glossarySelectors.js';
import thunks from '@/app/thunks/glossaryThunks.js';
import { GlossaryNode, GlossaryEntryType } from 'types/glossaryEntry.js';

import { AppDispatch } from '@/app/store.js';
import { rehydrateGlossaryTree } from '@/features/Glossary/utils/rehydrateGlossary.js';
import { showModal } from '@/app/slice/modalSlice.js';
import { useModalActions } from '../global/useModal.js';
import { useSidePanel } from '../global/useSidePanel.js';
import { Glossary } from '@/features/Glossary/Directory/GlossarySidePanel.js';
import { updateUIKey } from '@/app/slice/uiSlice.js';
import { genericSubTypeIds } from '@/features/Glossary/EditGlossary/components/GlossaryPropertyLabels.js';

const useDirectoryManager = () => {
  const dispatch: AppDispatch = useDispatch();
  const glossaryId = useSelector(selectActiveId());
  const glossaries = useSelector(selectAllEditGlossaries());
  const activeGlossary = glossaries.find(
    (glossary) => glossary.id === glossaryId
  );
  const [glossary, setGlossary] = useState<Glossary | null>(
    activeGlossary || null
  );

  const { roots, nodeMap } = useSelector(selectGlossaryTree(glossaryId || ''));

  const nodes = useSelector(selectGlossaryStructure(glossaryId || ''));

  const { showModal } = useModalActions();

  //
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
    if (glossaries.length === 0 && glossary !== null) {
      setGlossary(null);
    } else if (glossaryId !== null) {
      const newGlossary = glossaries.find((g) => g.id === glossaryId);
      if (newGlossary && glossary?.id !== newGlossary.id) {
        setGlossary(newGlossary);
      }
    }
  }, [glossaryId, glossaries]);

  useEffect(() => {
    if (glossaryId !== null && nodes.length === 0) {
      dispatch(thunks.getNodes({ glossaryId }));
    }
  }, [glossaryId]);

  const handleSelect = (glossId: any) => {
    if (glossId === glossaryId) return;
    dispatch(setActiveGlossaryId({ glossaryId: glossId }));
    setGlossary(glossId);
  };

  const handleAddFolder = ({
    id,
    name,
    parentId,
    entryType,
  }: {
    id: string;
    name: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => {
    if (!glossaryId || !activeGlossary) return;
    const subTypeId =
      activeGlossary?.integrationState?.system?.[entryType]?.default ||
      genericSubTypeIds[entryType];
    const node: GlossaryNode = {
      id,
      name,
      fileType: 'section',
      parentId,
      glossaryId,
      entryType: entryType,
      children: [],
      subTypeId,
    };
    dispatch(thunks.createNodeAndEntryThunk({ node }));
  };

  const handleDelete = (node: any) => {
    if (node === null || glossaryId === null) return;
    const entry = {
      componentKey: 'ConfirmDeleteEntry',
      props: {
        node,
        glossaryId,
      },
      id: 'confirm-delete-entry',
    };
    showModal({ entry });
  };

  const handleMultipleDelete = (nodes: any[]) => {
    if (nodes.length === 0 || glossaryId === null) return;
    const entry = {
      componentKey: 'ConfirmMultipleDeleteEntries',
      props: {
        nodes,
        glossaryId,
      },
      id: 'confirm-multiple-delete-entries',
    };
    showModal({ entry });
  };

  const handleRename = (node: GlossaryNode) => {
    if (node === null) return;
    if (glossaryId === null) return;

    dispatch(
      thunks.renameNodeAndEntry({
        node,
      })
    );
  };

  const handleAddEntry = ({
    id,
    parentId,
    entryType,
  }: {
    id: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => {
    if (!entryType || !glossaryId || !activeGlossary) return;
    const subTypeId =
      activeGlossary?.integrationState?.system?.[entryType]?.default ||
      genericSubTypeIds[entryType];
    const node: GlossaryNode = {
      id,
      name: 'Untitled',
      entryType,
      fileType: 'detail',
      parentId,
      glossaryId,
      subTypeId,
    };
    dispatch(thunks.createNodeAndEntryThunk({ node }));
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
    setGlossary(null);
    dispatch(setActiveGlossaryId({ glossaryId: null }));
    localStorage.removeItem('lastActiveGlossaryId');
  };

  return {
    handleSelect,
    handleAddFolder,
    handleDelete,
    handleMultipleDelete,
    handleRename,
    handleAddEntry,
    deselectGlossary,
    glossary,
    roots,
    nodeMap,
  };
};

export default useDirectoryManager;
