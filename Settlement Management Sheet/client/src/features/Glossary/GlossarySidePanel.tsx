import React, { useEffect, useState, lazy, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import GlossaryDirectory from './GlossaryDirectory.js';
import { rehydrateGlossaryTree } from './helpers/rehydrateGlossary.js';
import {
  GlossaryEntryType,
  GlossaryNode,
} from '../../../../types/glossaryEntry.js';
import {
  selectActiveId,
  selectAllGlossaries,
  selectGlossaryStructure,
} from '../../app/selectors/glossarySelectors.js';
import thunks from '../../app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import { setActiveGlossaryId } from '../../app/slice/glossarySlice.js';
import { GlossaryDragProvider } from '@/context/DnD/GlossaryDragContext.js';
import { useSidePanel } from '@/hooks/global/useSidePanel.js';
import { useModalActions } from '@/hooks/global/useModal.js';

interface GlossarySidePanelProps {}

export interface Glossary {
  name: string;
  id: string | null;
  description: {
    markdown: string;
    string: string;
  };
}

const GlossarySidePanel: React.FC<GlossarySidePanelProps> = ({}) => {
  const glossaryId = useSelector(selectActiveId());
  const glossaries = useSelector(selectAllGlossaries());
  const activeGlossary = glossaries.find(
    (glossary) => glossary.id === glossaryId
  );
  const dispatch = useDispatch<AppDispatch>();
  const [glossary, setGlossary] = useState<Glossary | null>(
    activeGlossary || null
  );
  const { showModal } = useModalActions();

  const nodes = useSelector(selectGlossaryStructure(glossaryId || ''));
  const structure = useRef<GlossaryNode[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<string, GlossaryNode>>({});
  const { addNewTab } = useSidePanel();

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

  const rehydrate = () => {
    if (nodes) {
      const { roots, nodeMap } = rehydrateGlossaryTree(nodes);
      structure.current = roots;
      setNodeMap(nodeMap);
    }
  };

  useEffect(() => {
    if (glossaryId !== null && nodes) {
      rehydrate();
    }
  }, [nodes]);

  const handleSelect = (gloss: any) => {
    if (gloss.id === 'createNew') {
      setGlossary({
        name: '',
        id: '',
        description: {
          markdown: '',
          string: '',
        },
      });
    }
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

  return (
    <Box
      sx={{
        width: 300,
        padding: 2,
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          value={glossary ? glossary : null}
          options={[...glossaries]}
          getOptionLabel={(option: any) => option.name}
          onChange={(_, newValue) => {
            if (newValue) {
              handleSelect(newValue);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select a glossary"
              variant="outlined"
              fullWidth
              sx={{ width: '100%', position: 'relative' }}
            />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: 1,
              }}
              {...props}
              key={option.id}
            >
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                {option.name}
              </Typography>
            </Box>
          )}
          sx={{ width: '100%' }}
        />
        <IconButton
          sx={{ cursor: 'pointer', pr: 0 }}
          onClick={(e) => {
            e.preventDefault();
            handleSettingsClick();
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
      <GlossaryDragProvider>
        <GlossaryDirectory
          structure={structure.current}
          nodeMap={nodeMap}
          onRename={handleRename}
          onDelete={handleDelete}
          onNewFile={handleAddEntry}
          onNewFolder={handleAddFolder}
        />
      </GlossaryDragProvider>
    </Box>
  );
};

export default GlossarySidePanel;
