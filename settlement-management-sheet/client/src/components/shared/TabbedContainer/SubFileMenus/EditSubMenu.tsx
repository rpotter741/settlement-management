import { Tab } from '@/app/types/TabTypes.js';
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';

interface EditSubMenuProps {
  tab: Tab;
  editOpen: any;
  handleClose: (key: string) => void;
  menuSx: (side: 'left' | 'right') => React.CSSProperties;
}

const EditSubMenu: React.FC<EditSubMenuProps> = ({
  tab,
  editOpen,
  handleClose,
  menuSx,
}) => {
  const theme = useTheme();

  return (
    <Popper
      sx={{
        borderRadius: '8px',
        minWidth: '200px',
        zIndex: 1300,
      }}
      open={Boolean(editOpen)}
      anchorEl={editOpen}
      placement="bottom-start"
      transition
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom-start' ? 'left top' : 'left bottom',
          }}
          timeout={100}
        >
          <Paper>
            <ClickAwayListener onClickAway={() => handleClose('edit')}>
              <MenuList
                disablePadding
                sx={{ width: { xs: '100%', md: '300px' } }}
              >
                <MenuItem
                  sx={{ py: 0.5 }}
                  onClick={() => console.log('Discarding Changes')}
                >
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Discard Changes
                  </Typography>
                </MenuItem>
                <MenuItem
                  sx={{ py: 0.5 }}
                  onClick={() => console.log('Resetting to Default')}
                >
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Reset to Default
                  </Typography>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default EditSubMenu;
