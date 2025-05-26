import React, { useState, MouseEvent, useRef } from 'react';
import { v4 as newId } from 'uuid';
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
import CheckIcon from '@mui/icons-material/Check';
import RoomIcon from '@mui/icons-material/Room';
import MapIcon from '@mui/icons-material/Map';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { GlossaryEntryType, GlossaryNode } from '../../../../types';
import { useTheme } from '../../context/ThemeContext';
import { set } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {
  nodeRenderState,
  selectActiveId,
  selectNodeById,
} from './state/glossarySelectors';
import { toggleExpand, toggleNameEdit } from './state/glossarySlice';
import { AppDispatch } from '@/app/store';
import capitalize from '../../utility/capitalize';

interface GlossaryDirectoryProps {
  structure: GlossaryNode[] | [];
  onRename: (node: GlossaryNode) => void;
  onDelete: ({
    id,
    entryType,
    glossaryId,
  }: {
    id: string;
    entryType: GlossaryEntryType;
    glossaryId: string | null;
  }) => void;
  onNewFile: ({
    id,
    parentId,
    entryType,
  }: {
    id: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => void;
  onNewFolder: ({
    id,
    name,
    parentId,
  }: {
    id: string;
    name: string;
    parentId: string | null;
  }) => void;
}

const entryTypes = ['region', 'location', 'poi', 'person', 'faction', 'note'];

const entryTypeColors: Record<string, string> = {
  region: 'secondary.main',
  location: 'honey.main',
  poi: 'rgba(185, 80 , 222, 1)',
  person: 'success.main',
  faction: 'error.main',
  note: 'text.primary',
};

const entryTypeIcons: Record<string, React.ReactNode> = {
  region: <PublicIcon sx={{ color: entryTypeColors.region }} />,
  location: <MapIcon sx={{ color: entryTypeColors.location }} />,
  poi: <RoomIcon sx={{ color: entryTypeColors.poi }} />,
  person: <PersonIcon sx={{ color: entryTypeColors.person }} />,
  faction: <GroupsIcon sx={{ color: entryTypeColors.faction }} />,
  note: <DescriptionIcon sx={{ color: entryTypeColors.note }} />,
};

const GlossaryDirectory: React.FC<GlossaryDirectoryProps> = ({
  structure,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder,
}) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: GlossaryNode | null;
  } | null>(null);
  const [submenuAnchor, setSubmenuAnchor] = useState<null | HTMLElement>(null);
  const glossaryId = useSelector(selectActiveId());

  const dispatch = useDispatch<AppDispatch>();

  //theme-aware highlight color... kind of
  const { themeKey } = useTheme();
  const softHighlight =
    themeKey === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const inputRef = useRef<HTMLInputElement | null>(null);

  const setRenameTarget = (node: GlossaryNode | null) => {
    if (node && glossaryId) {
      dispatch(toggleNameEdit({ glossaryId, nodeId: node.id }));
    }
  };

  const handleAddFolder = () => {
    contextMenu?.node
      ? onNewFolder({
          id: newId(),
          name: 'Untitled',
          parentId: contextMenu.node.id,
        })
      : onNewFolder({
          id: newId(),
          name: 'Untitled',
          parentId: null,
        });
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

  const NodeItem = ({ id }: { id: string }) => {
    if (glossaryId === null) return null;
    const data = useSelector(selectNodeById(glossaryId, id));
    if (!data) return null;
    const { expanded, rename } = useSelector(nodeRenderState(glossaryId, id));
    const [name, setName] = useState(data.name);

    React.useEffect(() => {
      if (rename && inputRef.current) {
        requestAnimationFrame(() => {
          inputRef.current.focus();
          inputRef.current.select();
        });
      }
    }, [rename]);

    const toggle = () => {
      if (data.type === 'folder') {
        dispatch(toggleExpand({ glossaryId, nodeId: id }));
      }
    };

    const processRename = (
      name: string,
      target: GlossaryNode | null,
      nodeId: string
    ) => {
      setName(name);
      setRenameTarget(target);
      dispatch(toggleNameEdit({ glossaryId, nodeId }));
    };

    return (
      <Box sx={{ pl: 2 }}>
        <Box
          sx={{
            display: 'grid',
            cursor: 'pointer',
            gridTemplateColumns: '24px 24px auto',
            alignItems: 'center',
            minHeight: '32px',
            '&:hover': {
              backgroundColor: softHighlight,
            },
            backgroundColor:
              contextMenu?.node?.id === id ? softHighlight : 'inherit',
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu(e, data);
          }}
          onClick={toggle}
        >
          {data.type === 'folder' && (
            <IconButton size="small">
              {expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
          {data.type === 'file' && <Box sx={{ width: '24px' }} />}
          {data.type === 'folder' ? (
            <FolderIcon sx={{ color: 'primary.main' }} />
          ) : data.entryType !== null ? (
            entryTypeIcons[data.entryType]
          ) : null}
          {rename ? (
            <TextField
              inputRef={inputRef}
              variant="standard"
              value={name}
              onBlur={(e) => {
                if (name.trim() === '') {
                  processRename(data.name, null, data.id);
                  return;
                }
                processRename(name, null, data.id);
                onRename({ ...data, name });
              }}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (name.trim() === '') {
                    processRename(data.name, null, data.id);
                    return;
                  }
                  processRename(name, null, data.id);
                  onRename({ ...data, name });
                } else if (e.key === 'Escape') {
                  processRename(data.name, null, data.id);
                }
              }}
            />
          ) : (
            <Typography
              sx={{
                ml: 1,
                textAlign: 'left',
              }}
            >
              {data.name}
            </Typography>
          )}
        </Box>

        {data.children && data.children.length > 0 && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {data.children.map((child) => (
              <NodeItem key={child.id} id={child.id} />
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
        <Button>Sort</Button>
      </ButtonGroup>
      {structure.map((node) => (
        <NodeItem key={node.id} id={node.id} />
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
              onClick={(e) => {
                setRenameTarget(contextMenu.node);
                closeContextMenu();
              }}
            >
              Rename
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                if (contextMenu.node) {
                  onDelete({
                    id: contextMenu.node.id,
                    entryType: contextMenu.node.entryType,
                    glossaryId,
                  });
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
                    e.preventDefault();
                    setSubmenuAnchor(e.currentTarget);
                  }}
                >
                  New File
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    if (contextMenu.node) {
                      onNewFolder({
                        id: newId(),
                        name: 'Untitled',
                        parentId: contextMenu.node.id,
                      });
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
            onClick={(e) => {
              e.preventDefault();
              onNewFile({
                id: newId(),
                parentId: contextMenu?.node?.id || null,
                entryType: type as GlossaryEntryType,
              });
              closeContextMenu();
            }}
          >
            {capitalize(type)}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default GlossaryDirectory;
