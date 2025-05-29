import React, { useEffect, useState, lazy, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as newId } from 'uuid';
import {
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Typography,
  Divider,
  Button,
  IconButton,
  TextField,
  ButtonGroup,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import SearchIcon from '@mui/icons-material/Search';

import GlossaryDirectory from './GlossaryDirectory';
import actions from './helpers/glossaryActions';
import { rehydrateGlossaryTree } from './helpers/rehydrateGlossary';
import { prepareCssVars } from '@mui/system';
import { GlossaryEntryType, GlossaryNode } from '../../../../types';
import {
  selectActiveId,
  selectAllGlossaries,
  selectGlossaryStructure,
  selectGlossaryNodes,
  selectSnackbar,
} from './state/glossarySelectors';
import { useSnackbar } from '../../context/SnackbarContext';
import thunks from './state/glossaryThunks';
import { thunk } from 'redux-thunk';
import { AppDispatch } from '@/app/store';
import { set } from 'lodash';
import { setActiveGlossaryId, setSnackbar } from './state/glossarySlice';
import { render } from 'react-dom';

const nameNewGlossary = lazy(() => import('./NameNewGlossary.js'));

interface GlossarySidePanelProps {
  setModalContent: (content: {
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    props: any;
  }) => void;
}

interface Glossary {
  name: string;
  id: string | null;
  description: string;
}

const GlossarySidePanel: React.FC<GlossarySidePanelProps> = ({
  setModalContent,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [glossary, setGlossary] = useState<Glossary>({
    name: '',
    id: '',
    description: '',
  });

  const glossaryId = useSelector(selectActiveId());
  const glossaries = useSelector(selectAllGlossaries());
  const nodes = useSelector(selectGlossaryStructure(glossaryId ?? ''));
  const structure = useRef<GlossaryNode[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<string, GlossaryNode>>({});
  const { showSnackbar } = useSnackbar();

  const snackbarMessage = useSelector(selectSnackbar());

  useEffect(() => {
    dispatch(thunks.getGlossaries());
  }, []);

  useEffect(() => {
    if (glossaries.length > 0 && glossary.id === '') {
      setGlossary(glossaries[0]);
      dispatch(setActiveGlossaryId({ glossaryId: glossaries[0].id }));
    }
  }, [glossaries, glossary.id]);

  useEffect(() => {
    if (glossaryId) {
      dispatch(thunks.getGlossaryNodes({ glossaryId }));
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
    rehydrate();
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
        type: string;
        duration: number;
        rollback?: any;
        rollbackFn?: ((rollback: any) => void) | (() => void);
      } = snackbarMessage;
      showSnackbar(message, type, duration);
      dispatch(setSnackbar({ snackbar: null }));
    }
  }, [snackbarMessage]);

  const handleSelect = (gloss: any) => {
    if (gloss.id === 'createNew') {
      setModalContent({
        component: nameNewGlossary,
        props: {
          setGlossary,
        },
      });
      setGlossary({ name: '', id: '', description: '' });
    }
    setGlossary(gloss);
  };

  const handleAddFolder = ({
    id,
    name,
    parentId,
    entryType = null,
  }: {
    id: string;
    name: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => {
    if (glossary.id === null) return;
    const node: GlossaryNode = {
      id,
      name,
      type: 'folder',
      parentId,
      glossaryId: glossary.id,
      entryType: entryType,
      children: [],
    };
    dispatch(thunks.addFolder({ node }));
  };

  const handleDelete = (node: any) => {
    if (node === null || glossaryId === null) return;
    const modelDelete = () => {
      dispatch(
        thunks.deleteEntry({
          id: node.id,
          entryType: node.entryType,
          glossaryId,
        })
      );
    };
    setModalContent({
      component: lazy(() => import('./ConfirmDelete')),
      props: {
        setModalContent,
        onDelete: modelDelete,
      },
    });
  };

  const handleRename = (node: GlossaryNode) => {
    if (node === null) return;
    if (glossaryId === null) return;
    dispatch(thunks.updateEntry({ node, glossaryId }));
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
      type: 'file',
      parentId,
      glossaryId,
    };
    dispatch(thunks.addEntry({ node }));
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
      <Autocomplete
        inputValue={glossary.name}
        options={[...glossaries, { name: 'Create New', id: 'createNew' }]}
        getOptionLabel={(option: any) => option.name}
        onChange={(event, newValue) => {
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
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="start">
                  <FindInPageIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: 1,
              }}
            >
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                {option.name}
              </Typography>
            </Box>
          </li>
        )}
      />
      <GlossaryDirectory
        structure={structure.current}
        onRename={handleRename}
        onDelete={handleDelete}
        onNewFile={handleAddEntry}
        onNewFolder={handleAddFolder}
      />
    </Box>
  );
};

export default GlossarySidePanel;
