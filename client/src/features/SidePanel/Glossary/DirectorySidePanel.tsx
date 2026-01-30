import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { ArrowBack, Search } from '@mui/icons-material';
import GlossaryDirectory from '@/features/Glossary/Directory/GlossaryDirectory.js';
import { GlossaryDragProvider } from '@/context/DnD/GlossaryDragContext.js';
import useDirectoryManager from '@/hooks/glossary/useDirectoryManager.js';
import GlossarySidePanelWrapper from '@/features/SidePanel/Glossary/GlossarySidePanelWrapper.js';
import { GlossaryNode } from '../../../../../shared/types/glossaryEntry.js';

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
    deselectGlossary,
    glossary,
    roots,
    nodeMap,
  } = useDirectoryManager();

  const [search, setSearch] = useState('');

  const filteredRoots = useMemo(() => {
    if (!search) return roots;
    return Object.values(nodeMap).filter((node) =>
      node.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [nodeMap, roots, search]);

  return (
    <GlossarySidePanelWrapper>
      <Box sx={{ height: '100vh' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={deselectGlossary}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            {glossary && glossary.name}
          </Typography>
        </Box>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{ py: 2, width: '100%' }}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ mr: 1 }} />,
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <GlossaryDragProvider>
          <GlossaryDirectory
            structure={filteredRoots}
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
