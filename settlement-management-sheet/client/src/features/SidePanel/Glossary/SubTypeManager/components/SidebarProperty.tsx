import { selectSubTypePropertyById } from '@/app/selectors/subTypeSelectors.js';
import useTheming from '@/hooks/layout/useTheming.js';
import {
  CalendarMonth,
  CheckBox,
  Close,
  Description,
  LinearScale,
  List,
  LooksOne,
  Pattern,
  TextFields,
} from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { SubTypePropertyTypes } from '@/features/Glossary/EditGlossary/Templates/generics/genericContinent.js';
import useGlobalDrag from '@/hooks/global/useGlobalDragKit.tsx';
import useUser from '@/hooks/auth/useUser.tsx';

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
  handlePropertyClick,
  propertyId,
  setHoverIndex,
  handlePropertyReorder,
  hoverIndex,
  isActive,
  handlePropertyDeletion,
}: {
  index: number;
  handlePropertyClick: (propertyId: string) => void;
  propertyId: string;
  setHoverIndex?: (index: number | null) => void;
  handlePropertyReorder?: (
    item: { kind: 'property'; groupId: string; propertyId: string },
    hoverIndex: number | null | undefined,
    hoverGroupId: string
  ) => void;
  hoverIndex?: number | null;
  isActive?: boolean;
  handlePropertyDeletion?: (propertyId: string) => void;
}) => {
  const { user } = useUser();
  const { darkenColor, lightenColor, getAlphaColor } = useTheming();
  const property = useSelector(
    selectSubTypePropertyById({
      propertyId,
    })
  );

  const { ref, canAccept, isOver, dragHandleProps } = useGlobalDrag({
    id: propertyId,
    dropType: 'subtype-property',
    type: 'subtype-property',
    types: [],
    index,
    item: property,
    interaction: 'both',
  });

  if (!ref) return null;

  const [isHover, setIsHover] = useState(false);

  console.log(property);

  return (
    <Box
      {...dragHandleProps}
      ref={ref}
      sx={{
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
        onClick={() => handlePropertyClick(propertyId)}
      >
        <Tooltip
          title={
            propertyTypeLabelMap[property?.inputType as SubTypePropertyTypes] ||
            'Unknown'
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {propertyTypeIconMap[property?.inputType!]}
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
          {`${property?.name}`}
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ color: isActive ? 'success.main' : 'text.secondary', mr: 4 }}
          >
            {property?.system ? '(S)' : '(U)'}
          </Typography>
        </Box>
      </Button>
      {user.role === 'admin' && handlePropertyDeletion && (
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
          onClick={() => handlePropertyDeletion(propertyId)}
        >
          <Close
            fontSize="small"
            sx={{ color: isHover ? 'warning.main' : 'transparent' }}
          />
        </IconButton>
      )}
      {user.role !== 'admin' && handlePropertyDeletion && !property?.system && (
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
          onClick={() => handlePropertyDeletion(propertyId)}
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

export default SidebarProperty;
