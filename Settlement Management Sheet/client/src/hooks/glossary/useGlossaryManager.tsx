import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveGlossaryId } from '@/app/slice/glossarySlice.js';
import { selectGlossaryStructure } from '@/app/selectors/glossarySelectors.js';
import thunks from '@/app/thunks/glossaryThunks.js';
import { GlossaryNode, GlossaryEntryType } from 'types/glossaryEntry.js';

import { AppDispatch } from '@/app/store.js';
import { rehydrateGlossaryTree } from '@/features/Glossary/utils/rehydrateGlossary.js';
import { showModal } from '@/app/slice/modalSlice.js';
import { useModalActions } from '../global/useModal.js';
import { useSidePanel } from '../global/useSidePanel.js';
import { Glossary } from '@/features/Glossary/Directory/GlossarySidePanel.js';

const useGlossaryManager = ({
  glossary,
  glossaries,
  glossaryId,
  structure,
  setGlossary,
  setNodeMap,
}: {
  glossary: Glossary | null;
  glossaries: Glossary[];
  glossaryId: string | null;
  structure: React.MutableRefObject<GlossaryNode[]>;
  setGlossary: React.Dispatch<React.SetStateAction<Glossary | null>>;
  setNodeMap: React.Dispatch<
    React.SetStateAction<Record<string, GlossaryNode>>
  >;
}) => {
  const dispatch: AppDispatch = useDispatch();

  const nodes = useSelector(selectGlossaryStructure(glossaryId || ''));

  const { showModal } = useModalActions();

  const { addNewTab } = useSidePanel();

  //
  useEffect(() => {
    dispatch(thunks.getGlossaries());
  }, []);

  useEffect(() => {
    if (glossaries.length > 0 && glossaryId === null) {
      dispatch(setActiveGlossaryId({ glossaryId: glossaries[0].id }));
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
    if (glossaryId !== null) {
      dispatch(thunks.getNodes({ glossaryId }));
    }
  }, [glossaryId]);

  function rehydrate() {
    if (nodes) {
      const { roots, nodeMap } = rehydrateGlossaryTree(nodes);
      structure.current = roots;
      setNodeMap(nodeMap);
    }
  }

  useEffect(() => {
    if (glossaryId !== null && nodes) {
      rehydrate();
    }
  }, [nodes]);

  const handleSelect = (gloss: any) => {
    dispatch(setActiveGlossaryId({ glossaryId: gloss.id }));
    setGlossary(gloss);
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
    if (!glossaryId) return;
    const node: GlossaryNode = {
      id,
      name,
      fileType: 'section',
      parentId,
      glossaryId,
      entryType: entryType,
      children: [],
    };
    dispatch(thunks.createNodeAndSection({ node }));
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
    if (entryType === null) return;
    if (glossaryId === null) return;
    const node: GlossaryNode = {
      id,
      name: 'Untitled',
      entryType,
      fileType: 'detail',
      parentId,
      glossaryId,
    };
    dispatch(thunks.createNodeAndDetail({ node }));
  };

  const handleSettingsClick = () => {
    if (glossary === null || glossaryId === null) return;
    addNewTab({
      name: glossary?.name,
      glossaryId,
      id: glossaryId,
      mode: 'edit',
      tabType: 'glossary',
      tool: 'editGlossary',
      preventSplit: false,
      activate: true,
      side: 'left',
      disableMenu: true,
    });
  };

  return {
    handleSelect,
    handleAddFolder,
    handleDelete,
    handleRename,
    handleAddEntry,
    handleSettingsClick,
  };
};

export default useGlossaryManager;
