import React, { useState } from 'react';
import { Button, Box, ButtonGroup } from '@mui/material';

import FileSubMenu from './SubFileMenus/FileSubMenu.js';
import EditSubMenu from './SubFileMenus/EditSubMenu.js';
import ViewSubMenu from './SubFileMenus/ViewSubMenu.js';

import { useTheme, alpha } from '@mui/material/styles';
import { TabType } from '@/app/types/ToolTypes.js';
import { Tab } from '@/app/types/TabTypes.js';
import { useTools } from '@/hooks/tools/useTools.js';
import { ToolName } from 'types/common.js';
import { fontSize } from '@mui/system';

type MenuKey = 'file' | 'edit' | 'view' | 'tools' | 'help';

const menuItems: MenuKey[] = ['file', 'edit', 'view', 'tools', 'help'];

interface FileMenuProps {
  tab: Tab;
}

const FileMenu: React.FC<FileMenuProps> = ({ tab }) => {
  const [open, setOpen] = useState<any>({
    file: null,
    edit: null,
    view: null,
    tools: null,
    help: null,
  });

  const [subOpen, setSubOpen] = useState<any>({
    newFile: null,
  });

  const [anyOpen, setAnyOpen] = useState(false);

  const theme = useTheme();

  const handleClick = (e: any, key: string) => {
    e.preventDefault();
    setAnyOpen(true);
    switch (key) {
      case 'file':
        setOpen({
          file: e.currentTarget,
          edit: null,
          view: null,
          tools: null,
          help: null,
        });
        break;
      case 'edit':
        setOpen({
          edit: e.currentTarget,
          file: null,
          view: null,
          tools: null,
          help: null,
        });
        break;
      case 'view':
        setOpen({
          view: e.currentTarget,
          file: null,
          edit: null,
          tools: null,
          help: null,
        });
        break;
      case 'tools':
        setOpen({
          tools: e.currentTarget,
          file: null,
          edit: null,
          view: null,
          help: null,
        });
        break;
      case 'help':
        setOpen({
          help: e.currentTarget,
          file: null,
          edit: null,
          view: null,
          tools: null,
        });
        break;
      default:
        console.warn(`Unhandled menu click for key: ${key}`);
        break;
    }
  };

  const handleClose = (key: string) => {
    setOpen((prevOpen: any) => ({
      ...prevOpen,
      [key]: null,
    }));
    setAnyOpen(false);
  };

  const handleMouseEnter = (e: any, key: string) => {
    e.preventDefault();
    if (anyOpen) {
      handleClick(e, key);
      const oldSub = { ...subOpen };
      Object.keys(subOpen).forEach((k) => {
        oldSub[k] = null;
      });
      setSubOpen(oldSub);
    }
  };

  const buttonStyle = {
    color: theme.palette.text.primary,
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    py: 1,
    px: 2,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  };

  const menuSx = (side: 'left' | 'right') => ({
    my: 0.5,
    py: 0.5,
    gap: 2,
    '&:hover': {
      backgroundColor:
        side === 'left'
          ? (theme: any) => alpha(theme.palette.primary.main, 0.1)
          : (theme: any) => alpha(theme.palette.secondary.main, 0.1),
    },
  });

  return (
    <Box
      id={`file-menu-${tab.tabId}`}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
      }}
    >
      <Box
        color="divider"
        sx={{
          // borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRadius: 0,
        }}
      >
        {menuItems.map((key) => (
          <Button
            key={key}
            onClick={(e) => handleClick(e, key)}
            onMouseEnter={(e) => handleMouseEnter(e, key)}
            sx={buttonStyle}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Button>
        ))}
      </Box>
      <FileSubMenu
        tab={tab}
        fileOpen={open.file}
        handleClose={handleClose}
        subOpen={subOpen}
        setSubOpen={setSubOpen}
        menuSx={menuSx}
      />
      <EditSubMenu
        tab={tab}
        editOpen={open.edit}
        handleClose={handleClose}
        menuSx={menuSx}
      />
      <ViewSubMenu
        tab={tab}
        viewOpen={open.view}
        handleClose={handleClose}
        menuSx={menuSx}
      />
      {/* Add Tools and Help submenus as needed */}
    </Box>
  );
};

export default FileMenu;
