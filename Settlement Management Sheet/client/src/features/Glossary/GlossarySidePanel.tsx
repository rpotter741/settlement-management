import React, { useEffect, useState, lazy } from 'react';
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
import placeholderFn from 'utility/placeholderFn';
import { prepareCssVars } from '@mui/system';
import { GlossaryNode } from '../../../../types';

const nameNewGlossary = lazy(() => import('./NameNewGlossary.js'));

interface GlossarySidePanelProps {
  setModalContent: (content: {
    component: React.LazyExoticComponent<React.ComponentType<any>>;
    props: any;
  }) => void;
}

interface Glossary {
  name: string;
  id: string;
  description: string;
}

const GlossarySidePanel: React.FC<GlossarySidePanelProps> = ({
  setModalContent,
}) => {
  const [glossary, setGlossary] = useState({
    name: '',
    id: '',
    description: '',
  });
  const [glossaries, setGlossaries] = useState<Glossary[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>('root');
  const [nodes, setNodes] = useState<GlossaryNode[]>([]);

  useEffect(() => {
    const getGlossaries = async () => {
      const glossaries = await actions.getGlossaries();
      console.log('glizzy', glossaries);
      if (!glossaries) return;
      setGlossaries(glossaries);
    };
    getGlossaries();
  }, []);

  useEffect(() => {
    if (glossary.id === 'createNew') {
      setModalContent({
        component: nameNewGlossary,
        props: {
          setGlossary,
        },
      });
      setGlossary({ name: '', id: '', description: '' });
    }
  });

  useEffect(() => {
    if (glossaries.length > 0 && glossary.id === '') {
      setGlossary(glossaries[0]);
      buildStructure(glossaries[0].id);
    }
  }, [glossaries, glossary.id]);

  const handleSelect = (gloss: any) => {
    setGlossary(gloss);
    buildStructure(gloss.id);
  };

  const buildStructure = async (glossaryId: string) => {
    const structure = await actions.getGlossaryNodes({
      glossaryId: glossaryId,
    });
    const { roots, nodeMap } = rehydrateGlossaryTree(structure);
    setNodes(roots);
  };

  const handleAddNode = ({
    name,
    type,
    parentId,
  }: {
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
  }) => {
    const node = actions.createNode({
      name,
      type,
      parentId,
      glossaryId: glossary.id,
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
        structure={nodes}
        onSelect={placeholderFn}
        loadChildren={rehydrateGlossaryTree}
        onRename={placeholderFn}
        onDelete={placeholderFn}
        onNewFiled={placeholderFn}
        onNewFolder={handleAddNode}
      />
      <Button
        variant="contained"
        color="error"
        onClick={() => {}}
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '90%',
          boxSizing: 'border-box',
        }}
      >
        Delete Glossary
      </Button>
    </Box>
  );
};

export default GlossarySidePanel;
