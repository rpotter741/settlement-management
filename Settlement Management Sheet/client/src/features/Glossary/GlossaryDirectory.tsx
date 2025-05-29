import React, { useState, MouseEvent, useRef, useEffect, useMemo } from 'react';
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
import TerrainIcon from '@mui/icons-material/Terrain';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlagIcon from '@mui/icons-material/Flag';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WbShadeIcon from '@mui/icons-material/WbShade';
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
import flattenVisibleNodes from '../Selection/helpers/flattenVisibleNodes';

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
    entryType,
  }: {
    id: string;
    name: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => void;
}

const entryTypes = ['location', 'poi', 'person', 'note', 'event'];

const folderTypes = [
  'continent',
  'nation',
  'region',
  'settlement',
  'faction',
  'geography',
];

const entryTypeColors: Record<string, string> = {
  continent: 'info.main',
  nation: 'primary.main',
  settlement: 'warning.main',
  region: 'secondary.main',
  location: 'honey.main',
  poi: 'rgba(185, 80 , 222, 1)',
  person: 'success.main',
  faction: 'error.main',
  note: 'text.primary',
  event: 'text.secondary',
  geography: 'success.dark',
};

const entryTypeIcons: Record<string, React.ReactNode> = {
  continent: <PublicIcon sx={{ color: entryTypeColors.continent }} />,
  nation: <AccountBalanceIcon sx={{ color: entryTypeColors.nation }} />,
  settlement: <WbShadeIcon sx={{ color: entryTypeColors.settlement }} />,
  region: <FlagIcon sx={{ color: entryTypeColors.region }} />,
  location: <MapIcon sx={{ color: entryTypeColors.location }} />,
  poi: <RoomIcon sx={{ color: entryTypeColors.poi }} />,
  person: <PersonIcon sx={{ color: entryTypeColors.person }} />,
  faction: <GroupsIcon sx={{ color: entryTypeColors.faction }} />,
  note: <DescriptionIcon sx={{ color: entryTypeColors.note }} />,
  event: <CalendarMonthIcon sx={{ color: entryTypeColors.event }} />,
  geography: <TerrainIcon sx={{ color: entryTypeColors.geography }} />,
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
  const dispatch = useDispatch<AppDispatch>();

  const [submenuAnchor, setSubmenuAnchor] = useState<null | HTMLElement>(null);
  const [folderAnchor, setFolderAnchor] = useState<null | HTMLElement>(null);
  const glossaryId = useSelector(selectActiveId());
  const renderState = useSelector((state: any) =>
    glossaryId !== null
      ? state.glossary.glossaries[glossaryId]?.renderState || {}
      : {}
  );
  const visibleNodeList = useMemo(
    () => flattenVisibleNodes({ tree: structure, renderState }),
    [structure, renderState]
  );
  const idToIndex = useMemo(() => {
    const map: Record<string, number> = {};
    visibleNodeList.forEach((id, index) => {
      map[id] = index;
    });
    return map;
  }, [visibleNodeList]);

  const [selected, setSelected] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    console.log(selected, 'selected nodes');
  }, [selected]);

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
    setFolderAnchor(null);
  };

  const isMultiSelect = (e) => e.metaKey || e.ctrlKey;

  const handleClick = (e, nodeId, index) => {
    if (e.shiftKey && lastSelectedIndex !== null) {
      const range = [lastSelectedIndex, index].sort((a, b) => a - b);
      const rangeIds = visibleNodeList
        .slice(range[0], range[1] + 1)
        .map((node) => node.id);
      setSelected((prev) => Array.from(new Set([...prev, ...rangeIds])));
    } else if (isMultiSelect(e)) {
      setSelected((prev) =>
        prev.includes(nodeId)
          ? prev.filter((id) => id !== nodeId)
          : [...prev, nodeId]
      );
      setLastSelectedIndex(index);
    } else {
      setSelected([nodeId]);
      setLastSelectedIndex(index);
    }
  };

  console.log(structure);

  const NodeItem = ({ id }: { id: string }) => {
    if (glossaryId === null) return null;
    const data = useSelector(selectNodeById(glossaryId, id));
    if (!data) return null;
    const { expanded, rename } = useSelector(nodeRenderState(glossaryId, id));
    const [name, setName] = useState(data.name);
    const [open, setOpen] = useState(expanded);

    useEffect(() => {
      if (rename && inputRef.current) {
        requestAnimationFrame(() => {
          if (inputRef.current === null) return;
          inputRef.current.focus();
          inputRef.current.select();
        });
      }
    }, [rename]);

    useEffect(() => {
      setOpen(expanded);
    }, [expanded]);

    const toggle = () => {
      setOpen((prev) => !prev);
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
              contextMenu?.node?.id === id
                ? softHighlight
                : selected.includes(id)
                  ? softHighlight
                  : 'transparent',
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            handleContextMenu(e, data);
          }}
          onClick={(e) => {
            e.preventDefault();
            handleClick(e, data.id, idToIndex[data.id]);
          }}
        >
          {data.type === 'folder' && (
            <IconButton onClick={toggle} size="small">
              {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
          {data.type === 'file' && <Box sx={{ width: '24px' }} />}
          {data.type === 'folder' &&
          !folderTypes.includes(data.entryType as string) ? (
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
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit={true}
            onExited={() => {
              dispatch(
                toggleExpand({ glossaryId, nodeId: data.id, expanded: false })
              );
            }}
            onEntered={() => {
              dispatch(
                toggleExpand({ glossaryId, nodeId: data.id, expanded: true })
              );
            }}
          >
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
        <Button onClick={(e) => setFolderAnchor(e.currentTarget)}>
          Add Folder
        </Button>
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
                    setFolderAnchor(e.currentTarget);
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
            {type !== 'poi' ? capitalize(type) : 'Point of Interest'}
          </MenuItem>
        ))}
      </Menu>

      {/* Submenu for New Folder */}
      <Menu
        anchorEl={folderAnchor}
        open={Boolean(folderAnchor)}
        onClose={() => setFolderAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {folderTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={(e) => {
              e.preventDefault();
              onNewFolder({
                id: newId(),
                name: 'Untitled',
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
