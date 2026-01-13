import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Typography,
  TabClassKey,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '@/app/slice/snackbarSlice.js';
import { AppDispatch } from '@/app/store.js';
import { ToolName } from 'types/common.js';
import {
  LibraryAdd,
  Public,
  PublicOff,
  Save,
  SaveAs,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Tab } from '@/app/types/TabTypes.js';
import {
  createNewToolFile,
  saveToolFile,
} from '@/app/thunks/fileMenuThunks.js';

interface FileSubMenuProps {
  tab: Tab;
  fileOpen: any;
  handleClose: (key: string) => void;
  subOpen: any;
  setSubOpen: React.Dispatch<React.SetStateAction<any>>;
  menuSx: (side: 'left' | 'right') => React.CSSProperties;
}

const fileSubMenuOptions = [
  {
    name: 'New File',
    icon: <LibraryAdd />,
  },
  {
    name: 'Save',
    icon: <Save />,
  },
  {
    name: 'Save As',
    icon: <SaveAs />,
  },
  {
    name: 'Publish',
    icon: <Public />,
  },
  {
    name: 'Unpublish',
    icon: <PublicOff />,
  },
];

const FileSubMenu: React.FC<FileSubMenuProps> = ({
  tab,
  fileOpen,
  handleClose,
  subOpen,
  setSubOpen,
  menuSx,
}) => {
  const side = tab.side;
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();

  const handleNewFileMenuClose = () => {
    setSubOpen((prev: any) => ({
      ...prev,
      newFile: null,
    }));
  };

  return (
    <Popper
      sx={{
        boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        minWidth: '200px',
        zIndex: 1300, // Ensure it appears above other elements
      }}
      open={Boolean(fileOpen)}
      anchorEl={fileOpen}
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
            <ClickAwayListener onClickAway={() => handleClose('file')}>
              <MenuList
                disablePadding
                sx={{ width: { xs: '100%', md: '300px' } }}
              >
                <MenuItem
                  sx={menuSx(side)}
                  onMouseEnter={(e) => {
                    setSubOpen((prev: any) => ({
                      ...prev,
                      newFile: e.currentTarget,
                    }));
                  }}
                >
                  <LibraryAdd />
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, textAlign: 'left' }}
                  >
                    New File
                  </Typography>
                </MenuItem>
                <MenuItem
                  sx={menuSx(side)}
                  onClick={() => {
                    dispatch(saveToolFile(tab));
                    handleClose('file');
                  }}
                  onMouseEnter={handleNewFileMenuClose}
                >
                  <Save />
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, textAlign: 'left' }}
                  >
                    Save
                  </Typography>
                </MenuItem>
                <MenuItem
                  sx={menuSx(side)}
                  onClick={() => console.log('Save As')}
                  onMouseEnter={handleNewFileMenuClose}
                >
                  <SaveAs />
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, textAlign: 'left' }}
                  >
                    Save As
                  </Typography>
                </MenuItem>
                <MenuItem
                  sx={menuSx(side)}
                  onClick={() => console.log('Publish')}
                  onMouseEnter={handleNewFileMenuClose}
                >
                  <Public />
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, textAlign: 'left' }}
                  >
                    Publish
                  </Typography>
                </MenuItem>
                <MenuItem
                  sx={menuSx(side)}
                  onClick={() => console.log('Unpublish')}
                  onMouseEnter={handleNewFileMenuClose}
                >
                  <PublicOff />
                  <Typography
                    variant="body2"
                    sx={{ flexGrow: 1, textAlign: 'left' }}
                  >
                    Unpublish
                  </Typography>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
            <NewFileSubMenu
              tab={tab}
              newFileMenu={subOpen.newFile}
              handleClose={handleNewFileMenuClose}
              side={side}
              menuSx={menuSx}
            />
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default FileSubMenu;

const FileOptions = {
  apt: 'APT',
  action: 'Action',
  attribute: 'Attribute',
  building: 'Building',
  category: 'Category',
  event: 'Event',
  listener: 'Listener',
  settlementType: 'Settlement Type',
  settlement: 'Settlement',
  gameStatus: 'Status',
  storyThread: 'Story Thread',
  tradeHub: 'Trade Hub',
  upgrade: 'Upgrade',
};

interface NewFileSubMenuProps {
  tab: Tab;
  newFileMenu: any;
  handleClose: () => void;
  side: 'left' | 'right';
  menuSx: (side: 'left' | 'right') => React.CSSProperties;
}

const NewFileSubMenu: React.FC<NewFileSubMenuProps> = ({
  tab,
  newFileMenu,
  handleClose,
  side,
  menuSx,
}) => {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();
  return (
    <Popper
      sx={{
        borderRadius: '8px',
        minWidth: '200px',
        zIndex: 1300, // Ensure it appears above other elements
      }}
      open={Boolean(newFileMenu)}
      anchorEl={newFileMenu}
      placement="right-start"
      transition
      onMouseLeave={() => handleClose()}
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin: placement === 'bottom-start' ? 'left top' : 'left',
          }}
          timeout={100}
        >
          <Paper>
            <ClickAwayListener onClickAway={() => handleClose()}>
              <MenuList
                disablePadding
                sx={{ width: { xs: '100%', md: '200px' } }}
              >
                {Object.entries(FileOptions).map(([tool, name]) => (
                  <MenuItem
                    key={tool}
                    sx={menuSx(side)}
                    onClick={() => {
                      dispatch(createNewToolFile(tool, side));
                      handleClose();
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ flexGrow: 1, textAlign: 'left' }}
                    >
                      {name}
                    </Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
