import { dispatch } from '@/app/constants.js';
import { SubTypeGroup, SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { addPropertyToGroupThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyToGroupThunk.js';
import { removeGroupPropertyThunk } from '@/app/thunks/glossary/subtypes/groups/removeGroupPropertyThunk.js';
import { useDnDContext } from '@/context/DnD/GlobalDndContext.tsx';
import { propertyTypeIconMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import useGlobalDrag from '@/hooks/global/useGlobalDragKit.tsx';
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
  const { dragType } = useDnDContext();
  const { ref, canAccept, isOver, dragHandleProps } = useGlobalDrag({
    id: property.id,
    dropType: 'subtype-group-property',
    interaction: 'both',
    types: ['subtype-group-property', 'subtype-property'],
    item: {
      groupId: group.id,
      id: property.id,
      index,
    },
    index,
    type: 'subtype-group-property',
  });

  if (!ref) return null;

  return (
    <Box
      {...dragHandleProps}
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
        backgroundColor: isOver
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
