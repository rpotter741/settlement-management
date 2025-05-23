import React, { useState, MouseEvent } from 'react';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  Button,
  Collapse,
  IconButton,
  ButtonGroup,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WarningIcon from '@mui/icons-material/Warning';
import { GlossaryNode } from '../../../../types';
import { set } from 'lodash';

interface GlossaryDirectoryProps {
  structure: GlossaryNode[] | [];
  onSelect: (node: GlossaryNode) => void;
  onRename: (node: GlossaryNode, newName: string) => void;
  onDelete: (node: GlossaryNode) => void;
  onNewFile: (parent: GlossaryNode, entryType: string) => void;
  onNewFolder: ({
    name,
    type,
    parentId,
  }: {
    name: string;
    type: 'file' | 'folder';
    parentId: string | null;
  }) => void;
}

const entryTypes = ['Region', 'Location', 'POI', 'Person', 'Faction'];

const GlossaryDirectory: React.FC<GlossaryDirectoryProps> = ({
  structure,
  onSelect,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder,
}) => {
  console.log(structure);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: GlossaryNode | null;
  } | null>(null);
  const [submenuAnchor, setSubmenuAnchor] = useState<null | HTMLElement>(null);
  const [renameTarget, setRenameTarget] = useState<GlossaryNode | null>(null);
  const [newName, setNewName] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  React.useEffect(() => {
    console.log(activeFolder);
  }, [activeFolder]);

  const onClickFolder = (node: GlossaryNode) => {
    if (activeFolder === node.id) {
      return setActiveFolder(null);
    }
    setActiveFolder(node.id);
  };

  const handleAddFolder = () => {
    onNewFolder({ name: 'Untitled', type: 'folder', parentId: activeFolder });
  };

  const handleContextMenu = (event: MouseEvent, node: GlossaryNode) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      node,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
    setSubmenuAnchor(null);
  };

  const handleRename = () => {
    if (renameTarget && newName.trim() !== '') {
      onRename(renameTarget, newName.trim());
      setRenameTarget(null);
      setNewName('');
    }
  };

  const NodeItem = ({
    node,
    onClickFolder,
  }: {
    node: GlossaryNode;
    onClickFolder: (node: GlossaryNode) => void;
  }) => {
    const [isExpanded, setExpanded] = useState(false);

    React.useEffect(() => {
      console.log(isExpanded);
    }, [isExpanded]);

    const toggle = () => {
      if (node.type === 'folder') {
        // onClickFolder(node);
        setExpanded((prev) => !prev);
      }
    };

    return (
      <Box sx={{ pl: 2 }} onClick={toggle}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {node.type === 'folder' &&
            (isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />)}
          {node.type === 'folder' ? <FolderIcon /> : <DescriptionIcon />}
          <Typography sx={{ ml: 1 }} onClick={() => onSelect(node)}>
            {node.name}
          </Typography>
        </Box>

        {node.children && node.children.length > 0 && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            {node.children.map((child) => (
              <NodeItem
                key={child.id}
                node={child}
                onClickFolder={onClickFolder}
              />
            ))}
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <ButtonGroup variant="text">
        <Button onClick={handleAddFolder}>Add Folder</Button>
        <Button onClick={(e) => setSubmenuAnchor(e.currentTarget)}>
          Add File
        </Button>
      </ButtonGroup>
      {structure.map((node) => (
        <NodeItem key={node.id} node={node} onClickFolder={onClickFolder} />
      ))}
      {/* Context menu */}
      <Menu
        open={Boolean(contextMenu)}
        onClose={closeContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {contextMenu?.node && (
          <>
            <MenuItem
              onClick={() => {
                setRenameTarget(contextMenu.node);
                closeContextMenu();
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (contextMenu.node) {
                  onDelete(contextMenu.node);
                  closeContextMenu();
                }
              }}
            >
              Delete
            </MenuItem>
            {contextMenu.node.type === 'folder' && (
              <>
                <MenuItem
                  onClick={(e) => {
                    setSubmenuAnchor(e.currentTarget);
                  }}
                >
                  New File
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (contextMenu.node) {
                      onNewFolder(contextMenu.node, 'New Folder');
                      closeContextMenu();
                    }
                  }}
                >
                  New Folder
                </MenuItem>
              </>
            )}
          </>
        )}
      </Menu>

      {/* Submenu for New File */}
      <Menu
        anchorEl={submenuAnchor}
        open={Boolean(submenuAnchor)}
        onClose={() => setSubmenuAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {entryTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={() => {
              if (contextMenu?.node) {
                onNewFile(contextMenu.node, type);
              }
              closeContextMenu();
            }}
          >
            {type}
          </MenuItem>
        ))}
      </Menu>

      {/* Rename prompt */}
      {renameTarget && (
        <Box
          sx={{
            position: 'absolute',
            top: contextMenu?.mouseY,
            left: contextMenu?.mouseX,
            backgroundColor: 'background.paper',
            p: 2,
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <TextField
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New Name"
            autoFocus
          />
          <Button
            onClick={handleRename}
            variant="contained"
            size="small"
            sx={{ ml: 1 }}
          >
            Rename
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GlossaryDirectory;
