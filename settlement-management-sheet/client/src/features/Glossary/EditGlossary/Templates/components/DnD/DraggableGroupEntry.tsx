import { dispatch } from '@/app/constants.js';
import { selectSubTypeGroups } from '@/app/selectors/subTypeSelectors.js';
import {
  SubType,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { addPropertyToGroupThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyToGroupThunk.js';
import { removeGroupPropertyThunk } from '@/app/thunks/glossary/subtypes/groups/removeGroupPropertyThunk.js';
import { reorderGroupPropertiesThunk } from '@/app/thunks/glossary/subtypes/groups/reorderGroupPropertiesThunk.js';
import { removeGroupFromSubTypeThunk } from '@/app/thunks/glossary/subtypes/schemas/removeGroupFromSubTypeThunk.js';
import { propertyTypeIconMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import useGlobalDrag from '@/hooks/global/useGlobalDrag.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { Delete, DragHandle } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const DraggableGroupEntry = ({
  group,
  subtype,
  index,
  hoverIndex,
  setHoverIndex,
  groupLinkId,
}: {
  group: SubTypeGroup;
  subtype: SubType;
  index: number;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  groupLinkId: string;
}) => {
  const allGroups = useSelector(selectSubTypeGroups);
  const [isHover, setIsHover] = useState(false);
  const { lightenColor, getAlphaColor } = useTheming();
  const { ref, draggedType } = useGlobalDrag({
    interaction: 'both',
    types: ['subtype-group', 'subtype-group-reorder'],
    item: {
      id: group.id,
      index,
    },
    onHover: (item) => {
      // item.id !== group.id ? setHoverIndex(index) : setHoverIndex(null);
      setHoverIndex(index);
    },
    onDrop: (item) => {
      if (draggedType === 'subtype-property') {
        dispatch(
          addPropertyToGroupThunk({
            groupId: group.id,
            propertyId: item.id,
          })
        );
      } else if (draggedType === 'subtype-group-property') {
        //reordering within group handled in DraggablePropertyEntry
        if (item.index === index) return;
        const order = group?.properties.length || 0;
        const newOrder = [...group.properties].map((p) => p.propertyId);
        newOrder.splice(item.index, 1);
        newOrder.splice(order, 0, item.id);
        dispatch(
          reorderGroupPropertiesThunk({
            groupId: group.id,
            newOrder: newOrder,
          })
        );
      }
    },
    onEnd: () => {},
    index,
    type: 'subtype-group',
  });

  function ownsAnchor(groupId: string, subtype: SubType) {
    const group = allGroups.find((g) => g.id === groupId);
    const isAnchor = group?.properties.some(
      (p) =>
        p.propertyId === subtype.anchors.primary ||
        p.propertyId === subtype.anchors.secondary
    );
    return isAnchor;
  }
  return (
    <Box
      ref={ref}
      key={group.id}
      sx={{
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        justifyContent: 'start',
        width: '100%',
        position: 'relative',
        cursor: 'grab',
        backgroundColor:
          hoverIndex === index
            ? getAlphaColor({
                color: 'success',
                key: 'light',
                opacity: 0.3,
              })
            : index % 2 === 0
              ? lightenColor({
                  color: 'background',
                  key: 'default',
                  amount: 0.1,
                })
              : 'background.default',
      }}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <DragHandle
        sx={{
          color: isHover ? 'text.secondary' : 'transparent',
          cursor: 'grab',
        }}
      />
      <Typography sx={{ width: '50%', textAlign: 'start' }}>
        {`${group.name} ${ownsAnchor(group.id, subtype) ? '*' : ''}`}
      </Typography>
      <IconButton
        sx={{ position: 'absolute', right: 0 }}
        onClick={() => {
          dispatch(
            removeGroupFromSubTypeThunk({
              subtypeId: subtype.id,
              linkIds: [groupLinkId],
            })
          );
        }}
      >
        <Delete
          sx={{
            color: isHover ? 'error.main' : 'transparent',
            cursor: 'pointer',
          }}
        />
      </IconButton>
    </Box>
  );
};

export default DraggableGroupEntry;
