import React, { useState, useEffect } from 'react';

import { Box, IconButton, Menu, MenuItem } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

const MobileMenu = () => {
  return (
    <Box>
      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: editMode ? 'primary.main' : 'accent.main',
          color: editMode ? 'common.white' : 'text.primary',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        onClick={(event) => {
          setOpenMenu(!openMenu);
          if (openMenu) {
            setAnchorEl(null);
          } else {
            setAnchorEl(event.currentTarget);
          }
        }}
      >
        <EllipsisIcon />
      </IconButton>
      <Menu
        open={openMenu}
        anchorEl={anchorEl}
        onClose={() => setOpenMenu(false)}
      >
        {editMode && (
          <MenuItem>
            <IconButton>
              <SaveIcon />
              {/* <Typography sx={{ ml: 1 }}>Save Changes</Typography> */}
            </IconButton>
          </MenuItem>
        )}
        <MenuItem>
          <IconButton>
            {editMode ? (
              <>
                <CancelIcon />
                {/* <Typography sx={{ ml: 1 }}>Cancel Changes</Typography> */}
              </>
            ) : (
              <>
                <EditIcon />
                {/* <Typography sx={{ ml: 1 }}>Edit</Typography> */}
              </>
            )}
          </IconButton>
        </MenuItem>
        <MenuItem>
          <IconButton>
            <WriteIcon />
            {/* <Typography sx={{ ml: 1 }}>Publish</Typography> */}
          </IconButton>
        </MenuItem>
        <MenuItem>
          <IconButton>
            <LoadIcon />
            {/* <Typography sx={{ ml: 1 }}>Load</Typography> */}
          </IconButton>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MobileMenu;
