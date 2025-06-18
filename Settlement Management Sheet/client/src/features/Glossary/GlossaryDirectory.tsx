import React, {
  useState,
  MouseEvent,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
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
  Tooltip,
} from '@mui/material';
import {
  Folder as FolderIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Edit,
  OpenInFull,
  OpenInNew,
  Delete,
  Create,
  DocumentScanner,
  Drafts,
  InsertDriveFileSharp,
  Description,
  NoteAdd,
  CreateNewFolder,
  Sort,
  AddToPhotos,
} from '@mui/icons-material';
import {
  GlossaryEntryType,
  GlossaryNode,
} from '../../../../types/glossaryEntry.js';
import { useTheme } from '@/context/ThemeContext.js';
import { useSelector, useDispatch } from 'react-redux';
import { useSidePanel } from '@/hooks/useSidePanel.js';
import {
  nodeRenderState,
  selectActiveId,
  selectNodeById,
  glossaryRenderState,
} from '../../app/selectors/glossarySelectors.js';
import { toggleExpand, toggleNameEdit } from '../../app/slice/glossarySlice.js';
import { AppDispatch } from '@/app/store.js';
import capitalize from '../../utility/capitalize.js';
import flattenVisibleNodes from '../Selection/helpers/flattenVisibleNodes.js';
import {
  entryTypeIcons,
  entryTypes,
  folderTypes,
} from './helpers/glossaryTypeIcon.js';
import { useGlossaryDrag } from '@/context/DnD/GlossaryDragContext.js';
import { DragWrapper, DropZone } from '@/components/index.js';
import { GlossaryDirectoryProps } from '@/app/types/GlossaryTypes.js';
import { find, set } from 'lodash';
import { removeTab } from '@/app/slice/sidePanelSlice.js';
import { findAndDeleteTab } from '@/app/thunks/sidePanelThunks.js';

const GlossaryDirectory: React.FC<GlossaryDirectoryProps> = ({
  structure,
  nodeMap,
  onRename,
  onDelete,
  onNewFile,
  onNewFolder,
  handleCreateGlossary,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    node: GlossaryNode | null;
  } | null>(null);
  const [submenuAnchor, setSubmenuAnchor] = useState<null | HTMLElement>(null);
  const [folderAnchor, setFolderAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const { draggedType, endDrag, startDrag, draggedItem } = useGlossaryDrag();
  const { addNewTab } = useSidePanel();

  //theme-aware highlight color... kind of
  const themeContext = useTheme();
  const themeKey = themeContext?.themeKey ?? 'light';
  const softHighlight =
    themeKey === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  const inputRef = useRef<HTMLInputElement | null>(null);

  const glossaryId = useSelector(selectActiveId());
  const renderState = useSelector(glossaryRenderState(glossaryId));

  //click delineation

  const visibleNodeList = useMemo(
    () =>
      flattenVisibleNodes({ tree: structure, renderState: renderState ?? {} }),
    [structure, renderState]
  );
  const idToIndex = useMemo(() => {
    const map: Record<string, number> = {};
    visibleNodeList.forEach((node, index) => {
      map[node.id] = index;
    });
    return map;
  }, [visibleNodeList]);

  useEffect(() => {
    console.log(selected, 'selected nodes');
  }, [selected]);

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

  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const isMultiSelect = (e: any) => e.metaKey || e.ctrlKey;

  const singleClick = useCallback(
    (e: MouseEvent, nodeId: string, index: number) => {
      if (e.shiftKey && lastSelectedIndex !== null) {
        const range = [lastSelectedIndex, index].sort((a, b) => a - b);
        const rangeIds = visibleNodeList
          .slice(range[0], range[1] + 1)
          .map((node: any) => node.id);

        const allSelected = rangeIds.every((id) => selected.includes(id));
        if (allSelected) {
          setSelected((prev) => prev.filter((id) => !rangeIds.includes(id)));
        } else {
          setSelected((prev) => Array.from(new Set([...prev, ...rangeIds])));
        }
      } else if (isMultiSelect(e)) {
        setSelected((prev) =>
          prev.includes(nodeId)
            ? prev.filter((id) => id !== nodeId)
            : [...prev, nodeId]
        );
        setLastSelectedIndex(index);
      } else {
        selected.includes(nodeId) ? setSelected([]) : setSelected([nodeId]);
        setLastSelectedIndex(index);
      }
    },
    [visibleNodeList, lastSelectedIndex, selected]
  );

  const doubleClick = useCallback(
    (e: MouseEvent, nodeId: string) => {
      if (nodeMap[nodeId].entryType === null) return;
      addNewTab({
        name: nodeMap[nodeId].name,
        id: nodeId,
        mode: 'edit',
        tool: nodeMap[nodeId].entryType,
        tabId: newId(),
        scroll: 0,
        preventSplit: false,
        activate: true,
        side: 'left',
        tabType: 'glossary',
        glossaryId: glossaryId ?? undefined,
      });
    },
    [nodeMap, addNewTab, glossaryId]
  );

  const NodeItem = ({ id, offset }: { id: string; offset: number }) => {
    if (glossaryId === null) return null;
    const data = useSelector(selectNodeById(glossaryId, id));
    if (!data) return null;
    const { expanded, rename } = useSelector(nodeRenderState(glossaryId, id));
    const [name, setName] = useState<string>(data.name);
    const [open, setOpen] = useState<boolean>(expanded);

    const handleSingleClick = (e: MouseEvent) => {
      e.preventDefault();
      clickTimeout.current = setTimeout(() => {
        singleClick(e, data.id, idToIndex[data.id]);
      }, 150);
    };

    const handleDoubleClick = (e: MouseEvent) => {
      e.preventDefault();
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
      }
      doubleClick(e, data.id);
    };

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
      dispatch(toggleExpand({ glossaryId, nodeId: data.id, expanded: !open }));
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
      <Box
        sx={{
          pl: 2,
          ml: offset * 2,
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
      >
        {data.type === 'folder' && (
          <IconButton onClick={toggle} size="small" sx={{ zIndex: 3 }}>
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
            role="button"
            tabIndex={0}
            sx={{
              ml: 1,
              textAlign: 'left',
              width: '100%',
              cursor: 'pointer',
              userSelect: 'none',
              fontSize: '0.875rem',
            }}
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
          >
            {data.name}
          </Typography>
        )}
      </Box>
    );
  };

  const fileTypes = ['person', 'note', 'event', 'location'];

  const dragAcceptMap = {
    continent: [
      'territory',
      'domain',
      'province',
      'landmark',
      'settlement',
      'faction',
      ...fileTypes,
    ],
    region: [
      'domain',
      'province',
      'landmark',
      'settlement',
      'faction',
      ...fileTypes,
    ],
    nation: ['province', 'landmark', 'settlement', 'faction', ...fileTypes],
    province: ['landmark', 'settlement', 'faction', ...fileTypes],
    landmark: ['settlement', 'faction', ...fileTypes],
    settlement: ['faction', , ...fileTypes],
    faction: [...fileTypes],
  };

  return (
    <Box>
      <ButtonGroup variant="text">
        <Tooltip title={<Typography>Create New Glossary</Typography>}>
          <IconButton onClick={handleCreateGlossary}>
            <AddToPhotos />
          </IconButton>
        </Tooltip>
        <Tooltip title={<Typography>Add New Section</Typography>}>
          <span>
            <IconButton
              disabled={!glossaryId}
              onClick={(e) => setFolderAnchor(e.currentTarget)}
            >
              <CreateNewFolder />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={<Typography>Add New Detail</Typography>}>
          <span>
            <IconButton
              disabled={!glossaryId}
              onClick={(e) => setSubmenuAnchor(e.currentTarget)}
            >
              <NoteAdd />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={<Typography>Sort</Typography>}>
          <IconButton>
            <Sort />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      {visibleNodeList.map((entry) => {
        const node = nodeMap[entry.id];
        return (
          <DropZone
            key={entry.id}
            type={
              node.entryType && node.entryType in dragAcceptMap
                ? dragAcceptMap[node.entryType as keyof typeof dragAcceptMap]
                    .filter((t): t is string => typeof t === 'string')
                    .filter((t): t is string => t !== undefined)
                : []
            }
            handleAdd={() => {}}
            draggedType={draggedType}
            endDrag={endDrag}
            styleType="glossary"
            bg2="success.main"
            onReorder={() => {}}
          >
            <DragWrapper
              type={node.entryType ?? ''}
              item={node}
              startDrag={startDrag}
              endDrag={endDrag}
            >
              <NodeItem key={node.id} id={node.id} offset={entry.depth} />
            </DragWrapper>
          </DropZone>
        );
      })}
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
                e.preventDefault();
                if (contextMenu.node) {
                  addNewTab({
                    name: contextMenu.node.name,
                    id: contextMenu.node.id,
                    mode: 'edit',
                    tool: contextMenu.node.entryType,
                    tabId: newId(),
                    scroll: 0,
                    preventSplit: false,
                    activate: true,
                    side: 'left',
                    tabType: 'glossary',
                    glossaryId: glossaryId ?? undefined,
                  });
                }
                closeContextMenu();
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {<OpenInNew />}
              Open
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                setRenameTarget(contextMenu.node);
                closeContextMenu();
              }}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              {<Edit />}
              Rename
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                if (contextMenu.node) {
                  onDelete(contextMenu.node);
                  closeContextMenu();
                }
              }}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Delete />
              Delete
            </MenuItem>
            {contextMenu.node.type === 'folder' && (
              <>
                <MenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setSubmenuAnchor(e.currentTarget);
                  }}
                  sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  <InsertDriveFileSharp />
                  New Detail
                </MenuItem>
                {contextMenu.node.entryType !== 'faction' && (
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setFolderAnchor(e.currentTarget);
                    }}
                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <FolderIcon />
                    New Section
                  </MenuItem>
                )}
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
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            {entryTypeIcons[type] || (
              <FolderIcon sx={{ color: 'primary.main' }} />
            )}
            {capitalize(type)}
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
        {folderTypes.map((type, n) => {
          const parentIndex = folderTypes.indexOf(
            contextMenu?.node?.entryType || ''
          );
          if (contextMenu !== null) {
            if (
              parentIndex === -1 ||
              (contextMenu?.node?.type && contextMenu.node.type !== 'folder')
            )
              return null; // Only show folder types if parent is a folder
            if (n <= parentIndex) return null; // Only show folder types that are below the parent type in the hierarchy
          }
          return (
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
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                gap: 4,
              }}
            >
              {entryTypeIcons[type] || (
                <FolderIcon sx={{ color: 'primary.main' }} />
              )}
              {capitalize(type)}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default GlossaryDirectory;
