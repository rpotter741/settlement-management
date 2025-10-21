import { selectSubTypePropertyById } from '@/app/selectors/glossarySelectors.js';
import useTheming from '@/hooks/layout/useTheming.js';
import {
  CalendarMonth,
  CheckBox,
  Close,
  Description,
  DragHandle,
  LinearScale,
  List,
  LooksOne,
  Pattern,
  TextFields,
} from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import { useCallback, useRef } from 'react';
import { RelayStatus } from '@/hooks/global/useRelay.js';
import { SubTypePropertyTypes } from '@/features/Glossary/EditGlossary/Templates/generics/genericContinent.js';
import { useDrag, useDrop } from 'react-dnd';

const propertyTypeIconMap: Record<string, React.ReactNode> = {
  text: <TextFields fontSize="small" />,
  number: <LooksOne fontSize="small" />,
  richtext: <Description fontSize="small" />,
  date: <CalendarMonth fontSize="small" />,
  dropdown: <List fontSize="small" />,
  checkbox: <CheckBox fontSize="small" />,
  range: <LinearScale fontSize="small" />,
  compound: <Pattern fontSize="small" />,
};

const propertyTypeLabelMap: Record<SubTypePropertyTypes, string> = {
  text: 'Text',
  date: 'Date',
  dropdown: 'Dropdown',
  checkbox: 'Checkbox',
  range: 'Range',
  compound: 'Compound',
};

export { propertyTypeIconMap, propertyTypeLabelMap };

const SidebarProperty = ({
  index,
  glossaryId,
  hoverGroup,
  setHoverGroup,
  handlePropertyClick,
  groupId,
  propertyId,
  subTypeId,
  type,
  mode,
  activeProperty,
  setPropertyHoverIndex,
  handlePropertyReorder,
  propertyHoverIndex,
}: {
  index: number;
  glossaryId: string;
  hoverGroup: string | null;
  setHoverGroup: (id: string | null) => void;
  handlePropertyClick: () => void;
  groupId: string;
  propertyId: string;
  subTypeId: string;
  type: GlossaryEntryType;
  mode: 'focus' | 'form' | 'preview';
  activeProperty: string | null;
  setPropertyHoverIndex: (
    data: { groupId: string; index: number } | null
  ) => void;
  handlePropertyReorder: (
    item: { kind: 'property'; groupId: string; propertyId: string },
    hoverIndex: number | null | undefined,
    hoverGroupId: string
  ) => void;
  propertyHoverIndex: { groupId: string; index: number } | null;
}) => {
  const { darkenColor, lightenColor, getAlphaColor } = useTheming();
  const property = useSelector(
    selectSubTypePropertyById({
      glossaryId,
      subTypeId,
      type,
      groupId,
      propertyId,
    })
  );
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'sub-type-property',
    item: { kind: 'property', groupId, propertyId, index },
  });

  const [, drop] = useDrop({
    accept: 'sub-type-property',
    hover: () => {
      setPropertyHoverIndex({ groupId, index });
    },
    drop: (item: { kind: 'property'; groupId: string; propertyId: string }) => {
      if (item.propertyId !== propertyId) {
        handlePropertyReorder(
          item,
          propertyHoverIndex?.index ?? null,
          propertyHoverIndex?.groupId ?? groupId
        );
      }
      setPropertyHoverIndex(null);
    },
  });

  drag(drop(ref));

  if (!property) return null;

  return (
    <Box
      ref={ref}
      sx={{ width: '100%', display: 'flex', position: 'relative' }}
      onMouseEnter={() => setHoverGroup(propertyId)}
      onMouseLeave={() => setHoverGroup(null)}
    >
      <Box
        sx={{
          width: '100%',
          p: 1,
          textAlign: 'start',
          pl: 4,
          bgcolor:
            hoverGroup === groupId
              ? darkenColor({
                  color: 'action',
                  key: 'hover',
                  amount: 0.33,
                })
              : hoverGroup === propertyId ||
                  (propertyHoverIndex &&
                    propertyHoverIndex.groupId === groupId &&
                    propertyHoverIndex.index === index)
                ? lightenColor({
                    color: 'action',
                    key: 'hover',
                    amount: 0.33,
                  })
                : 'inherit',
        }}
        onClick={handlePropertyClick}
      >
        <Button
          size="small"
          variant="text"
          sx={{
            background: 'transparent',
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            color:
              activeProperty === propertyId ? 'success.main' : 'text.primary',
            justifyContent: 'start',
            width: '100%',
            overflow: 'hidden',
          }}
          onClick={handlePropertyClick}
        >
          <Tooltip
            title={
              propertyTypeLabelMap[property.type as SubTypePropertyTypes] ||
              'Unknown'
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {propertyTypeIconMap[property.type]}
            </Box>
          </Tooltip>
          <Box
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flexGrow: 1,
              textAlign: 'start',
            }}
          >
            {property.name}
          </Box>
        </Button>
      </Box>
      {hoverGroup === propertyId && (
        <>
          <DragHandle
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              cursor: 'grab',
            }}
          />
          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '0.5rem',
            }}
          >
            <Close sx={{ fontSize: '1rem' }} />
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default SidebarProperty;
