import { dispatch } from '@/app/constants.js';
import { SubTypeGroup, SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { addPropertyToGroupThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyToGroupThunk.js';
import { removeGroupPropertyThunk } from '@/app/thunks/glossary/subtypes/groups/removeGroupPropertyThunk.js';
import { reorderGroupPropertiesThunk } from '@/app/thunks/glossary/subtypes/groups/reorderGroupPropertiesThunk.js';
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

const columnSizes = [
  {
    label: 'Small',
    value: 1,
  },
  {
    label: 'Medium',
    value: 2,
  },
  {
    label: 'Large',
    value: 4,
  },
];

const DraggablePropertyEntry = ({
  property,
  group,
  index,
  hoverIndex,
  setHoverIndex,
  updateWidth,
  columnSize,
}: {
  property: SubTypeProperty;
  group: SubTypeGroup;
  index: number;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  updateWidth: (propertyId: string, width: number) => void;
  columnSize: number;
}) => {
  const [isHover, setIsHover] = useState(false);
  const { lightenColor, getAlphaColor } = useTheming();
  const { ref, draggedType } = useGlobalDrag({
    interaction: 'both',
    types: ['subtype-group-property', 'subtype-property'],
    item: {
      id: property.id,
      index,
    },
    onHover: (item) => {
      item.id !== property.id ? setHoverIndex(index) : setHoverIndex(null);
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
        const newOrder = [...group.properties].map((p) => p.propertyId);
        newOrder.splice(item.index, 1);
        newOrder.splice(index, 0, item.id);
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
    type: 'subtype-group-property',
  });
  return (
    <Box
      ref={ref}
      key={property.id}
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
      {propertyTypeIconMap[property.inputType]}
      <Typography sx={{ width: '50%', textAlign: 'start' }}>
        {property.name}
      </Typography>
      <FormControl sx={{ width: '25%' }}>
        <InputLabel id="width-select">Width:</InputLabel>
        <Select
          label="Width"
          labelId="width-select"
          value={columnSizes.find((cs) => cs.value === columnSize)?.value || 4}
          sx={{ textAlign: 'start' }}
          size="small"
        >
          {columnSizes.map((setting) => (
            <MenuItem
              key={setting.value}
              onClick={() => updateWidth(property.id, setting.value)}
              value={setting.value}
            >
              {setting.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton
        sx={{ position: 'absolute', right: 0 }}
        onClick={() => {
          dispatch(
            removeGroupPropertyThunk({
              groupId: group.id,
              propertyId: property.id,
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

export default DraggablePropertyEntry;
