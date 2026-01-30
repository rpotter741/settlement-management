import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import GlossaryDirectory from './GlossaryDirectory.js';
import {
  selectActiveId,
  selectAllEditGlossaries,
  selectGlossaryTree,
} from '../../../app/selectors/glossarySelectors.js';
import { GlossaryDragProvider } from '@/context/DnD/GlossaryDragContext.js';
import useDirectoryManager from '@/hooks/glossary/useDirectoryManager.js';
import GlossarySidePanelWrapper from '@/features/SidePanel/Glossary/GlossarySidePanelWrapper.js';

interface GlossarySidePanelProps {}

export interface Glossary {
  name: string;
  id: string | null;
  description: {
    markdown: string;
    string: string;
  };
}

const GlossarySidePanel: React.FC<GlossarySidePanelProps> = () => {
  const {
    handleAddFolder,
    handleDelete,
    handleMultipleDelete,
    handleRename,
    handleAddEntry,
    glossary,
    roots,
    nodeMap,
  } = useDirectoryManager();

  return (
    <GlossarySidePanelWrapper>
      <Box sx={{ height: '100vh' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            {glossary && glossary.name}
          </Typography>
        </Box>
        <GlossaryDragProvider>
          <GlossaryDirectory
            structure={roots}
            nodeMap={nodeMap}
            onRename={handleRename}
            onDelete={handleDelete}
            onMultipleDelete={handleMultipleDelete}
            onNewFile={handleAddEntry}
            onNewFolder={handleAddFolder}
          />
        </GlossaryDragProvider>
      </Box>
    </GlossarySidePanelWrapper>
  );
};

export default GlossarySidePanel;
