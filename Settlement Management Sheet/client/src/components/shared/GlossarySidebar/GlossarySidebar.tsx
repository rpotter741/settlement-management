import React, { useState } from 'react';
import {
  Drawer,
  Modal,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function GlossarySidebar() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* Floating Icon */}
      <IconButton
        onClick={toggleOpen}
        sx={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 1300,
        }}
      >
        <InfoIcon />
      </IconButton>

      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Drawer
          anchor="right"
          open={open}
          onClose={toggleOpen}
          variant="persistent"
          sx={{
            width: 300,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 300,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Glossary</Typography>
            <Typography paragraph>
              This is the glossary content for desktop users.
            </Typography>
          </Box>
        </Drawer>
      )}

      {/* Bottom Drawer or Modal for Mobile */}
      {isMobile && (
        <Modal open={open} onClose={toggleOpen}>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 2,
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Typography variant="h6">Glossary</Typography>
            <Typography paragraph>
              This is the glossary content for mobile users.
            </Typography>
          </Box>
        </Modal>
      )}
    </>
  );
}

export default GlossarySidebar;
