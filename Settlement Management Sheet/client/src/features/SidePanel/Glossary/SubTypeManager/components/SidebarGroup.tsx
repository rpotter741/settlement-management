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
import { dispatch } from '@/app/constants.js';
import { addSubTypeProperty } from '@/app/slice/glossarySlice.js';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import { v4 as newId } from 'uuid';
import { useSelector } from 'react-redux';
import { selectSubTypeGroupById } from '@/app/selectors/subTypeSelectors.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { RelayStatus } from '@/hooks/global/useRelay.js';
import { useCallback, useRef, useState } from 'react';
import changeSubTypeGroupNameDispatch from '@/app/dispatches/glossary/changeSubTypeGroupNameDispatch.js';
import { useDrag, useDrop } from 'react-dnd';
import { DropZone } from '@/components/index.js';
import { useSubTypePropertyDrag } from '@/context/DnD/SubTypePropertyDragContext.js';
import changeSubTypeGroupNameThunk from '@/app/thunks/glossary/subtypes/changeSubTypeGroupNameThunk.js';
import removeSubTypeGroupThunk from '@/app/thunks/glossary/subtypes/removeSubTypeGroupThunk.js';

const SidebarGroup = ({
  index,
  groupId,
  hoverGroup,
  setHoverGroup,
  openRelay,
  glossaryId,
  type,
  subTypeId,
  activeGroup,
  setActiveGroup,
  activeProperty,
  setActiveProperty,
  mode,
  setGroupHoverIndex,
  groupHoverIndex,
  handleGroupReorder,
  setPropertyHoverIndex,
  handlePropertyReorder,
  propertyHoverIndex,
  addProperty,
}: {
  index: number;
  groupId: string;
  hoverGroup: string | null;
  setHoverGroup: (id: string | null) => void;
  openRelay: ({ data, status }: { data: any; status: RelayStatus }) => void;
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  activeGroup: string | null;
  setActiveGroup: (id: string | null) => void;
  activeProperty: string | null;
  setActiveProperty: (id: string | null) => void;
  mode: 'focus' | 'form' | 'preview';
  setGroupHoverIndex: (index: number | null) => void;
  groupHoverIndex: number | null;
  handleGroupReorder: (
    item: {
      kind: 'group' | 'property';
      groupId: string;
      index: number;
      propertyId?: string;
    },
    hoverIndex: number,
    groupId: string
  ) => void;
  setPropertyHoverIndex: (
    data: { groupId: string; index: number } | null
  ) => void;
  handlePropertyReorder: (
    item: { kind: 'property'; groupId: string; propertyId: string },
    hoverIndex: number | null | undefined,
    hoverGroupId: string
  ) => void;
  propertyHoverIndex: { groupId: string; index: number } | null;
  addProperty: (groupId: string) => void;
}) => {
  const group = useSelector(
    selectSubTypeGroupById({
      subTypeId,
      groupId,
    })
  );

  const ref = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(group?.name || '');
  const [editing, setEditing] = useState(false);
  const [showProperties, setShowProperties] = useState(true);

  const [, drag] = useDrag({
    type: 'sub-type-group',
    item: { kind: 'group', groupId, index },
  });

  const [, drop] = useDrop({
    accept: ['sub-type-group', 'sub-type-property'],
    hover: () => {
      setGroupHoverIndex(index);
    },
    drop: (item: {
      kind: 'group' | 'property';
      groupId: string;
      index: number;
      propertyId?: string;
    }) => {
      if (item.kind === 'group' && item?.index === index) {
        return setGroupHoverIndex(null);
      }
      handleGroupReorder(item, index, groupId);
      setGroupHoverIndex(null);
    },
  });

  if (!group) return null;

  const handleGroupClick = useCallback(() => {
    setActiveGroup(groupId);
    setActiveProperty(group.propertyOrder[0] || null);
    openRelay({
      data: {
        setActiveGroup: groupId,
        setActiveProperty: group.propertyOrder[0] || null,
      },
      status: 'complete',
    });
  }, [groupId, setActiveGroup, openRelay]);

  const handlePropertyClick = useCallback(
    (propertyId: string) => {
      setActiveProperty(propertyId);
      setActiveGroup(groupId);
      openRelay({
        data: {
          setActiveProperty: propertyId,
          setActiveGroup: groupId,
        },
        status: 'complete',
      });
    },
    [groupId, setActiveGroup, openRelay]
  );

  drag(drop(ref));

  if (!group) return null;

  return (
    <>
      <Box
        sx={{
          py: 2,
          width: '100%',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor:
              hoverGroup === group.id || groupHoverIndex === index
                ? 'action.hover'
                : 'inherit',
          }}
          onMouseEnter={() => setHoverGroup(group.id)}
          onMouseLeave={() => setHoverGroup(null)}
        >
          <Box
            ref={ref}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              cursor: 'grab',
              color: activeGroup === group.id ? 'success.main' : 'text.primary',
              height: 40,
            }}
            onClick={handleGroupClick}
          >
            {editing ? (
              <TextField
                variant="standard"
                defaultValue={name}
                size="small"
                fullWidth
                onBlur={(e) => {
                  setName(e.target.value);
                  setEditing(false);
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setName((e.target as HTMLInputElement).value);
                    changeSubTypeGroupNameThunk({
                      subTypeId,
                      groupId: group.id,
                      name: (e.target as HTMLInputElement).value,
                    });
                    setEditing(false);
                  }
                  if (e.key === 'Escape') {
                    setEditing(false);
                  }
                }}
                sx={{ ml: 4, maxHeight: 32, p: 0 }}
              />
            ) : (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'start',
                    pl: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  {name}
                </Typography>
                <Typography variant="body1" component="span">
                  ({group.propertyOrder.length})
                </Typography>
              </>
            )}
          </Box>
          {hoverGroup === group.id && (
            <>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                }}
                onClick={() => setShowProperties(!showProperties)}
              >
                <ExpandMore sx={{ fontSize: '1rem' }} />
              </IconButton>
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  transform: 'translateY(-50%)',
                }}
              >
                <IconButton size="small" onClick={() => setEditing(true)}>
                  <Edit sx={{ fontSize: '1rem' }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    removeSubTypeGroupThunk({
                      subTypeId,
                      groupId,
                    });
                  }}
                >
                  <Close sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
        <Collapse in={showProperties} timeout="auto" unmountOnExit>
          {group.propertyOrder.map((property: string, n: number) => (
            <SidebarProperty
              key={property}
              index={n}
              hoverGroup={hoverGroup}
              setHoverGroup={setHoverGroup}
              handlePropertyClick={() => handlePropertyClick(property)}
              groupId={group.id}
              propertyId={property}
              subTypeId={subTypeId}
              type={type}
              glossaryId={glossaryId}
              mode={mode}
              activeProperty={activeProperty}
              setPropertyHoverIndex={setPropertyHoverIndex}
              handlePropertyReorder={handlePropertyReorder}
              propertyHoverIndex={propertyHoverIndex}
            />
          ))}
        </Collapse>
      </Box>
      {group.propertyOrder.length < 10 && (
        <>
          <Button onClick={() => addProperty(group.id)}>Add Property</Button>
        </>
      )}
    </>
  );
};

export default SidebarGroup;
