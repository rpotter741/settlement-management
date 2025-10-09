import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import GlossarySidePanelWrapper from '../GlossarySidePanelWrapper.js';
import SubTypeSelect from './SubTypeSelect.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import SubTypeSidebarEditor from './SubTypeSidebarEditor.js';

const SubTypeSidebarOrchestrator = () => {
  const [subTypeId, setSubTypeId] = useState<any>(null);
  const { deselectGlossary } = useGlossaryManager();

  const handleBackClick = () => {
    if (subTypeId === null) {
      deselectGlossary();
    } else {
      setSubTypeId(null);
    }
  };

  return (
    <GlossarySidePanelWrapper>
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
          onClick={handleBackClick}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          Glossary Sub-Types
        </Typography>
      </Box>
      <Box>
        {subTypeId === null ? (
          <SubTypeSelect setSubTypeId={setSubTypeId} />
        ) : (
          <SubTypeSidebarEditor subTypeId={subTypeId} />
        )}
      </Box>
    </GlossarySidePanelWrapper>
  );
};

export default SubTypeSidebarOrchestrator;
