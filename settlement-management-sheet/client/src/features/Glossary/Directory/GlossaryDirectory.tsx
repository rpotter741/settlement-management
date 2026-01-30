import React, {
  useState,
  MouseEvent,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { ulid as newId } from 'ulid';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  TextField,
  IconButton,
  ButtonGroup,
  Tooltip,
  Button,
} from '@mui/material';
import {
  Folder as FolderIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Edit,
  OpenInNew,
  Delete,
  InsertDriveFileSharp,
  NoteAdd,
  CreateNewFolder,
  Sort,
} from '@mui/icons-material';
import { GlossaryEntryType, GlossaryNode } from 'types/glossaryEntry.js';
import { useTheme } from '@/context/ThemeContext.js';
import { useSelector, useDispatch } from 'react-redux';
import { useSidePanel } from '@/hooks/global/useSidePanel.js';
import {
  nodeRenderState,
  selectActiveId,
  selectEditNodeById,
  glossaryRenderState,
  selectEditGlossaryById,
} from '../../../app/selectors/glossarySelectors.js';
import {
  toggleExpand,
  toggleNameEdit,
} from '../../../app/slice/glossarySlice.js';
import { AppDispatch } from '@/app/store.js';
import flattenVisibleNodes from '../../Selection/helpers/flattenVisibleNodes.js';
import {
  entryTypeIcons,
  entryTypes,
  folderTypes,
  dragAcceptMap,
} from '../utils/glossaryConstants.js';
import { useGlossaryDrag } from '@/context/DnD/GlossaryDragContext.js';
import { DragWrapper, DropZone } from '@/components/index.js';
import { GlossaryDirectoryProps } from '@/app/types/GlossaryTypes.js';
import { find, set } from 'lodash';
import { getOptionsContextMaps } from '@/utility/hasParentProperty.js';
import { SelectionObject } from '@/app/types/SelectionTypes.js';
import NodeItem, { RootNode } from './NodeItem.js';
import { usePropertyLabel } from '../utils/getPropertyLabel.js';

const GlossaryDirectory: React.FC<GlossaryDirectoryProps> = ({
  structure,
  nodeMap,
  onRename,
  onDelete,
  onMultipleDelete,
  onNewFile,
  onNewFolder,
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
  const glossary = useSelector(selectEditGlossaryById(glossaryId || ''));
  const renderState = useSelector(glossaryRenderState(glossaryId));

  const { getPropertyLabel } = usePropertyLabel();

  //click delineation
  const visibleNodeList = useMemo(() => {
    if (!structure || structure.length === 0 || !renderState) return [];
    return flattenVisibleNodes({
      tree: structure,
      renderState: renderState ?? {},
    });
  }, [structure, renderState]);

  const idToIndex = useMemo(() => {
    if (!visibleNodeList || visibleNodeList.length === 0) return {};
    const map: Record<string, number> = {};
    visibleNodeList.forEach((node: SelectionObject, index: number) => {
      map[node.id] = index;
    });
    return map;
  }, [visibleNodeList]);

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
    (e: React.MouseEvent<HTMLDivElement>, nodeId: string, index: number) => {
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
      console.log('double click', nodeId);
      if (nodeMap[nodeId].entryType === null) return;
      console.log('opening tab for', nodeMap[nodeId].name);
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

  //DRAG AND DROP
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <Box>
      <ButtonGroup variant="text" sx={{ mb: 0.33 }}>
        <Tooltip title={<Typography>Add New Section</Typography>}>
          <span>
            <IconButton
              disabled={!glossaryId}
              onClick={(e) => setFolderAnchor(e.currentTarget)}
              size="small"
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
              size="small"
            >
              <NoteAdd />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={<Typography>Sort</Typography>}>
          <IconButton size="small">
            <Sort />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
      <RootNode
        setHoverId={setHoverId}
        hoverId={hoverId}
        glossaryId={glossaryId || ''}
        id={'root-top'}
      />
      {visibleNodeList &&
        visibleNodeList.map((entry: any) => {
          const node = nodeMap[entry.id];
          if (!node) return null; // Skip if node is not found
          return (
            <NodeItem
              key={node.id}
              id={node.id}
              data={node}
              offset={entry.depth}
              glossaryId={glossaryId}
              clickTimeout={clickTimeout}
              singleClick={singleClick}
              idToIndex={idToIndex}
              doubleClick={doubleClick}
              inputRef={inputRef}
              setRenameTarget={setRenameTarget}
              contextMenu={contextMenu}
              handleContextMenu={handleContextMenu}
              softHighlight={softHighlight}
              selected={selected}
              onRename={onRename}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          );
        })}
      <RootNode
        setHoverId={setHoverId}
        hoverId={hoverId}
        glossaryId={glossaryId || ''}
        id={'root-bottom'}
      />
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
                if (selected.length > 1) {
                  onMultipleDelete(
                    selected
                      .map((id) => find(nodeMap, (n) => n.id === id))
                      .filter((n): n is GlossaryNode => n !== undefined)
                  );
                  closeContextMenu();
                  return;
                }
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
            {contextMenu.node.fileType === 'section' && (
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
                {contextMenu.node.entryType !== 'collective' && (
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
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                if (contextMenu.node) {
                  console.log(
                    getOptionsContextMaps({
                      node: contextMenu.node,
                      nodeStructure: nodeMap,
                    })
                  );
                }
              }}
            >
              Print Lineage Names
            </MenuItem>
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
            {getPropertyLabel(type).label}
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
              (contextMenu?.node?.fileType &&
                contextMenu.node.fileType !== 'section')
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
              {getPropertyLabel(type).label}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default GlossaryDirectory;
