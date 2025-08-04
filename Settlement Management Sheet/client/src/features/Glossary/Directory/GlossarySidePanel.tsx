import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
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
import { GlossaryNode } from 'types/glossaryEntry.js';
import {
  selectActiveId,
  selectAllEditGlossaries,
} from '../../../app/selectors/glossarySelectors.js';
import { GlossaryDragProvider } from '@/context/DnD/GlossaryDragContext.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';

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
  const glossaries = useSelector(selectAllEditGlossaries());
  const activeGlossary = glossaries.find(
    (glossary) => glossary.id === glossaryId
  );
  const [glossary, setGlossary] = useState<Glossary | null>(
    activeGlossary || null
  );

  const structure = useRef<GlossaryNode[]>([]);
  const [nodeMap, setNodeMap] = useState<Record<string, GlossaryNode>>({});

  const {
    handleSelect,
    handleAddFolder,
    handleDelete,
    handleRename,
    handleAddEntry,
    handleSettingsClick,
  } = useGlossaryManager({
    glossary,
    glossaries,
    glossaryId,
    structure,
    setGlossary,
    setNodeMap,
  });

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
          value={glossary ?? null}
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
