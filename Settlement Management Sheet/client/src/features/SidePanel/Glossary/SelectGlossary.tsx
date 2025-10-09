import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { Glossary } from '@/features/Glossary/Directory/GlossarySidePanel.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { Close, DragHandle } from '@mui/icons-material';
import { Button, IconButton, List, Typography } from '@mui/material';
import { useState } from 'react';

const GlossaryListSelect = ({
  handleSelect,
}: {
  handleSelect: (id: string) => void;
}) => {
  const { showModal } = useModalActions();
  const { getAlphaColor } = useTheming();
  const { glossaries, activeId } = useGlossaryEditor();

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const makeDeleteGlossaryEntry = (glossary: Glossary) => ({
    id: 'confirm-delete-glossary',
    componentKey: 'ConfirmDeleteGlossary',
    props: {
      glossary,
      tab: { side: null },
    },
  });

  const makeCreateGlossaryEntry = () => ({
    id: 'create-glossary',
    componentKey: 'NameNewGlossary',
    props: {},
  });

  const selectedBg = getAlphaColor({
    color: 'success',
    key: 'main',
    opacity: 0.2,
  });

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ flex: 1, height: 'calc(100vh - 40px)' }}
    >
      <Typography variant="h6">Glossary Select</Typography>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'start',
          gap: 2,
        }}
      >
        {glossaries.map((glossary, index) => (
          <Button
            variant="text"
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              width: '100%',
              gap: 1,
              backgroundColor:
                activeId === glossary.id ? selectedBg : 'inherit',
              '&:hover': {
                backgroundColor: hoverIndex === index ? selectedBg : 'inherit',
                cursor: 'pointer',
              },
            }}
            key={glossary.id}
            onClick={() => handleSelect(glossary.id)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <DragHandle
              sx={{
                color: hoverIndex === index ? 'primary.main' : 'transparent',
              }}
            />
            <Typography
              variant="body2"
              sx={{ fontWeight: 'bold', textAlign: 'left', width: '100%' }}
            >
              {glossary.name}
            </Typography>
            <IconButton
              size="small"
              onClick={() => {
                showModal({ entry: makeDeleteGlossaryEntry(glossary) });
              }}
              sx={{
                color: hoverIndex === index ? 'primary.main' : 'transparent',
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Button>
        ))}
      </List>
      <Button
        sx={{
          // position: 'absolute',
          bottom: 0,
          variant: 'contained',
          width: '100%',
          // ml: -2,
        }}
        onClick={() => {
          showModal({ entry: makeCreateGlossaryEntry() });
        }}
      >
        Create New Glossary
      </Button>
    </MotionBox>
  );
};

export default GlossaryListSelect;

/* nasal */
