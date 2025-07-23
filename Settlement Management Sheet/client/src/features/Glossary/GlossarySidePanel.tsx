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
  selectSnackbar,
} from '../../app/selectors/glossarySelectors.js';
import { SnackbarType } from '@/app/types/SnackbarTypes.js';
import thunks from '../../app/thunks/glossaryThunks.js';
import { AppDispatch } from '@/app/store.js';
import { setActiveGlossaryId } from '../../app/slice/glossarySlice.js';
import { GlossaryDragProvider } from '@/context/DnD/GlossaryDragContext.js';
import { useSidePanel } from '@/hooks/useSidePanel.js';
import { useModalActions } from '@/hooks/useModal.js';
import useSharedHooks from '@/hooks/useSharedHooks.js';

interface GlossarySidePanelProps {}

interface Glossary {
  name: string;
  id: string | null;
  description: string;
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

  const snackbarMessage = useSelector(selectSnackbar());
  const { utils } = useSharedHooks();

  useEffect(() => {
    dispatch(thunks.getGlossaries());
  }, []);

  useEffect(() => {
    if (glossaries.length > 0 && glossary === null) {
      dispatch(setActiveGlossaryId({ glossaryId: glossaries[0].id }));
    }
  }, [glossaries, glossary]);

  useEffect(() => {
    if (glossaries.length === 0 && glossary !== null) {
      setGlossary(null);
    }
  }, [glossaries, glossary]);

  useEffect(() => {
    if (glossary?.id !== glossaryId) {
      const newGlossary = glossaries.find(
        (glossary) => glossary.id === glossaryId
      );
      if (newGlossary) {
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
    if (glossaryId !== null) {
      rehydrate();
    }
  }, [nodes, structure.current.length]);

  useEffect(() => {
    if (snackbarMessage !== null) {
      const {
        message,
        type,
        duration,
        rollback,
        rollbackFn,
      }: {
        message: string;
        type: SnackbarType;
        duration: number;
        rollback?: any;
        rollbackFn?: ((rollback: any) => void) | (() => void);
      } = snackbarMessage;
      utils.snackbar({ message, type, duration });
    }
  }, [snackbarMessage]);

  const handleSelect = (gloss: any) => {
    if (gloss.id === 'createNew') {
      setGlossary({ name: '', id: '', description: '' });
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
    dispatch(thunks.addEntry({ node }));
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
    dispatch(thunks.addEntry({ node }));
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
