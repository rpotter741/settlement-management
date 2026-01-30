import { Box, IconButton, TextField, Typography } from '@mui/material';
import { dragAcceptMap, entryTypeIcons } from '../utils/glossaryConstants.js';
import { ChevronRight, ExpandMore } from '@mui/icons-material';
import { dispatch } from '@/app/constants.js';
import {
  reparentNodes,
  toggleExpand,
  toggleNameEdit,
  updateGlossaryNode,
  updateGlossaryNodes,
} from '@/app/slice/glossarySlice.js';
import { GlossaryNode } from '../../../../../shared/types/glossaryEntry.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  nodeRenderState,
  selectEditNodeById,
} from '@/app/selectors/glossarySelectors.js';
import { useSidePanel } from '@/hooks/global/useSidePanel.js';
import { ulid as newId } from 'ulid';
import { useDrag, useDrop } from 'react-dnd';
import reparentNodesThunk from '@/app/thunks/glossary/nodes/reparentNodesThunk.js';
import { useDragContext } from '@/context/DnD/DragContext.js';

const NodeItem = ({
  id,
  data,
  offset,
  glossaryId,
  clickTimeout,
  singleClick,
  idToIndex,
  doubleClick,
  inputRef,
  setRenameTarget,
  contextMenu,
  handleContextMenu,
  softHighlight,
  selected,
  onRename,
  hoverId,
  setHoverId,
}: {
  id: string;
  data: GlossaryNode;
  offset: number;
  glossaryId: string | null;
  clickTimeout: React.MutableRefObject<NodeJS.Timeout | null>;
  singleClick: (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
    index: number
  ) => void;
  idToIndex: { [key: string]: number };
  doubleClick: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setRenameTarget: (target: GlossaryNode | null) => void;
  contextMenu: {
    mouseX: number;
    mouseY: number;
    node: GlossaryNode | null;
  } | null;
  handleContextMenu: (e: React.MouseEvent<HTMLDivElement>, data: any) => void;
  softHighlight: string;
  selected: string[];
  onRename: (node: GlossaryNode) => void;
  hoverId: string | null;
  setHoverId: (id: string | null) => void;
}) => {
  if (glossaryId === null) return null;
  const { expanded, rename } = useSelector(nodeRenderState(glossaryId, id));
  const [name, setName] = useState<string>(data.name);
  const [open, setOpen] = useState<boolean>(expanded);

  const { addNewTab } = useSidePanel();

  const handleSingleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    clickTimeout.current = setTimeout(() => {
      singleClick(e, data.id, idToIndex[data.id]);
    }, 200);
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

  const accept = useMemo(
    () => dragAcceptMap[data.entryType as keyof typeof dragAcceptMap] ?? [],
    [data.entryType]
  );

  //DRAG AND DROP LOGIC HERE
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: data.entryType,
    item: { kind: 'node', node: data },
    end: (item, monitor) => {
      setHoverId(null);
    },
  });

  const [, drop] = useDrop({
    accept,
    hover: (item: { kind: 'node'; node: GlossaryNode }) => {
      if (accept.includes(item.node.entryType)) {
        setHoverId(data.id);
      }
    },
    drop: (item: { kind: 'node'; node: GlossaryNode }) => {
      //handle drop logic here
      if (accept.includes(item.node.entryType)) {
        dispatch(
          reparentNodesThunk({
            glossaryId,
            nodes: [item.node],
            newParentId: data.id,
          })
        );
      }
    },
  });

  drag(drop(ref));

  return (
    <Box
      className="glossary-node-item"
      ref={ref}
      sx={{
        pl: 2,
        ml: offset * 2,
        display: 'grid',
        cursor: 'pointer',
        gridTemplateColumns: '24px 24px auto',
        alignItems: 'center',
        minHeight: '32px',
        maxHeight: '32px',
        '&:hover': {
          backgroundColor: softHighlight,
        },
        backgroundColor:
          hoverId === id
            ? 'success.main'
            : contextMenu?.node?.id === id
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
      {data.fileType === 'section' && (
        <IconButton onClick={toggle} size="small" sx={{ zIndex: 3 }}>
          {open ? <ExpandMore /> : <ChevronRight />}
        </IconButton>
      )}
      {data.fileType === 'detail' && <Box sx={{ width: '24px' }} />}
      {entryTypeIcons[data.entryType]}
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
            if (data.name === 'Untitled') {
              addNewTab({
                name,
                id: data.id,
                mode: 'edit',
                tool: data.entryType,
                tabId: newId(),
                scroll: 0,
                preventSplit: false,
                activate: true,
                side: 'left',
                tabType: 'glossary',
                glossaryId: glossaryId ?? undefined,
              });
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
              if (data.name === 'Untitled') {
                addNewTab({
                  name,
                  id: data.id,
                  mode: 'edit',
                  tool: data.entryType,
                  tabId: newId(),
                  scroll: 0,
                  preventSplit: false,
                  activate: true,
                  side: 'left',
                  tabType: 'glossary',
                  glossaryId: glossaryId ?? undefined,
                });
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
          component="div"
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

export default NodeItem;

export const RootNode = ({
  setHoverId,
  hoverId,
  glossaryId,
  id,
}: {
  setHoverId: (id: string | null) => void;
  hoverId: string | null;
  glossaryId: string;
  id: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const accept = ['continent', ...dragAcceptMap['continent']];
  const [, drop] = useDrop({
    accept,
    hover: (item: { kind: 'node'; node: GlossaryNode }) => {
      if (accept.includes(item.node.entryType)) {
        setHoverId(id);
      }
    },
    drop: (item: { kind: 'node'; node: GlossaryNode }) => {
      //handle drop logic here
      if (accept.includes(item.node.entryType)) {
        dispatch(
          reparentNodesThunk({
            glossaryId,
            nodes: [item.node],
            newParentId: null,
          })
        );
      }
    },
  });

  drop(ref);

  return (
    <Box
      sx={{
        backgroundColor: hoverId === id ? 'success.main' : 'transparent',
        height: '15px',
        minHeight: '5px',
        position: 'relative',
      }}
      ref={ref}
    />
  );
};
