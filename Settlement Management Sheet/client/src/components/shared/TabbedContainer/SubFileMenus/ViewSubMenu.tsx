import { updateTab } from '@/app/slice/sidePanelSlice.js';
import { AppDispatch } from '@/app/store.js';
import { Tab } from '@/app/types/SidePanelTypes.js';
import { Edit, Preview } from '@mui/icons-material';
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
import { useDispatch } from 'react-redux';

interface ViewSubMenuProps {
  tab: Tab;
  viewOpen: any;
  handleClose: (key: string) => void;
  menuSx: (side: 'left' | 'right') => React.CSSProperties;
}

const ViewSubMenu: React.FC<ViewSubMenuProps> = ({
  tab,
  viewOpen,
  handleClose,
  menuSx,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();

  const handleModeToggle = () => {
    dispatch(
      updateTab({
        tabId: tab.tabId,
        side: tab.side,
        keypath: 'mode',
        updates: tab.mode === 'edit' ? 'preview' : 'edit',
      })
    );
    handleClose('view');
  };

  return (
    <Popper
      sx={{
        borderRadius: '8px',
        minWidth: '200px',
        zIndex: 1300,
      }}
      open={Boolean(viewOpen)}
      anchorEl={viewOpen}
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
            <ClickAwayListener onClickAway={() => handleClose('view')}>
              <MenuList
                disablePadding
                sx={{ width: { xs: '100%', md: '300px' } }}
              >
                <MenuItem
                  sx={menuSx(tab.side)}
                  onClick={handleModeToggle}
                  disabled={tab.tabType !== 'tool' || tab.mode === 'edit'}
                >
                  <Edit />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Edit Mode
                  </Typography>
                </MenuItem>
                <MenuItem
                  sx={menuSx(tab.side)}
                  onClick={handleModeToggle}
                  disabled={tab.tabType !== 'tool' || tab.mode === 'preview'}
                >
                  <Preview />
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    Preview Mode
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

export default ViewSubMenu;
