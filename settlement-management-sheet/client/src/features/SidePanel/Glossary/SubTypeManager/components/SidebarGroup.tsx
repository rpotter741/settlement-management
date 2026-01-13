import { Close, Edit, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import SidebarProperty from './SidebarProperty.js';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import { useSelector } from 'react-redux';
import { selectSubTypeGroupById } from '@/app/selectors/subTypeSelectors.js';
import { RelayStatus } from '@/hooks/global/useRelay.js';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import useGlobalDrag from '@/hooks/global/useGlobalDrag.js';
import useTheming from '@/hooks/layout/useTheming.js';

const SidebarGroup = ({
  index,
  handleGroupClick,
  groupId,
  hoverIndex,
  setHoverIndex,
  handleGroupReorder,
  isActive,
  handleGroupDeletion,
}: {
  index: number;
  handleGroupClick: (groupId: string | null) => void;
  groupId: string;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  handleGroupReorder: (
    item: {
      kind: 'subtype-group';
      groupId: string;
      index: number;
    },
    hoverIndex: number | null
  ) => void;
  isActive?: boolean;
  handleGroupDeletion?: (groupId: string) => void;
}) => {
  const group = useSelector(
    selectSubTypeGroupById({
      groupId,
    })
  );

  const { getAlphaColor, lightenColor } = useTheming();

  const { ref, draggedType, isDragging, matchesDragType } = useGlobalDrag({
    interaction: 'both',
    types: ['subtype-group', 'subtype-group-reorder'],
    type: 'subtype-group-reorder',
    item: { kind: 'subtype-group-reorder', groupId, index },
    onDrop: () => {
      setHoverIndex(null);
    },
    onHover: (item, monitor) => {
      if (item.kind === 'subtype-group-reorder') {
        handleGroupReorder(item, hoverIndex);
      }
    },
    index,
  });

  const [isHover, setIsHover] = useState(false);

  if (!group) return null;

  return (
    <Box
      ref={ref}
      sx={{
        pl: 2,
        width: '100%',
        display: 'flex',
        position: 'relative',
        maxHeight: '50px',
        height: '44px',
        my: 0.25,
        backgroundColor: isActive
          ? getAlphaColor({
              color: 'success',
              key: 'dark',
              opacity: 0.2,
            })
          : index % 2 === 0
            ? 'background.default'
            : 'background.paper',
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Button
        size="small"
        variant="text"
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          color: isActive ? 'success.main' : 'text.primary',
          justifyContent: 'start',
          width: '100%',
          overflow: 'hidden',
        }}
        onClick={() => handleGroupClick(groupId)}
      >
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flexGrow: 1,
            textAlign: 'start',
          }}
        >
          <Typography variant="body1" textTransform={'none'} component="span">
            {group.name}
          </Typography>
          <Typography variant="body2" component="span">
            {' '}
            ({group.properties.length})
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: isActive ? 'success.main' : 'text.secondary', mr: 4 }}
          >
            {group?.contentType}
          </Typography>
        </Box>
      </Button>
      {handleGroupDeletion && (
        <IconButton
          size="small"
          sx={{
            color: 'error.main',
            bgcolor: 'transparent',
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={() => handleGroupDeletion(groupId)}
        >
          <Close
            fontSize="small"
            sx={{ color: isHover ? 'warning.main' : 'transparent' }}
          />
        </IconButton>
      )}
    </Box>
  );
};

export default SidebarGroup;
