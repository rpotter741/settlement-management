import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { GlossaryEntryType } from '../../../../../../shared/types/glossaryEntry.js';
import useSubTypeEditor from '@/hooks/glossary/useSubTypeEditor.js';
import { useEffect, useMemo, useState } from 'react';
import { RelayStatus, useRelayChannel } from '@/hooks/global/useRelay.js';
import SidebarGroup from './components/SidebarGroup.js';
import { useSelector } from 'react-redux';
import { selectActiveId } from '@/app/selectors/glossarySelectors.js';
import { CenterFocusStrong, Description, Preview } from '@mui/icons-material';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import { SubTypePropertyDragProvider } from '@/context/DnD/SubTypePropertyDragContext.js';
import { cloneDeep, update } from 'lodash';
import reorderSubTypeGroupsThunk from '@/app/thunks/glossary/subtypes/reorderSubTypeGroupThunk.js';
import updateAllSubTypeGroupDataThunk from '@/app/thunks/glossary/subtypes/updateAllSubTypeGroupDataThunk.js';
import { useAutosave } from '@/hooks/utility/useAutosave/useAutosave.js';
import glossarySubTypeAutosaveConfig from '@/hooks/utility/useAutosave/configs/glossarySubTypeConfig.js';

const SubTypeSidebarEditor = ({
  editId,
  mode,
  setMode,
  openRelay,
  activeGroup,
  setActiveGroup,
  activeProperty,
  setActiveProperty,
}: {
  editId: string;
  mode: 'focus' | 'form' | 'preview';
  setMode: (mode: 'focus' | 'form' | 'preview') => void;
  openRelay: ({
    data,
    status,
  }: {
    data: any;
    status: RelayStatus | undefined;
  }) => void;
  activeGroup: string | null;
  setActiveGroup: (groupId: string | null) => void;
  activeProperty: string | null;
  setActiveProperty: (propertyId: string | null) => void;
}) => {
  //

  const glossaryId = useSelector(selectActiveId());
  const [hoverGroup, setHoverGroup] = useState<string | null>(null);
  const { subType, addGroup, addProperty } = useSubTypeEditor(editId);

  useAutosave(
    glossarySubTypeAutosaveConfig({
      glossaryId: glossaryId || '',
      name: subType ? `SubType:${subType.name}` : 'SubType:Unknown',
      intervalMs: 5000,
    })
  );

  const [groupHoverIndex, setGroupHoverIndex] = useState<number | null>(null);
  const [propertyHoverIndex, setPropertyHoverIndex] = useState<{
    groupId: string;
    index: number;
  } | null>(null);

  function handlePropertyReorder(
    item: { kind: 'property'; propertyId: string; groupId: string },
    hoverIndex: number | null | undefined,
    hoverGroupId: string
  ) {
    const srcGroupId = item.groupId;
    const propId = item.propertyId;

    const draft = cloneDeep(subType.groupData);

    // 1) Always recompute source index from id
    const srcOrder = Array.from(draft[srcGroupId].propertyOrder);
    const fromIndex = srcOrder.indexOf(propId);
    if (fromIndex === -1) return; // safety

    // Remove from source order
    srcOrder.splice(fromIndex, 1);
    draft[srcGroupId].propertyOrder = srcOrder;

    const sameGroup = srcGroupId === hoverGroupId;
    const tgtOrder = sameGroup
      ? srcOrder
      : Array.from(draft[hoverGroupId].propertyOrder);

    // 2) Normalize target index
    let toIndex: number;
    if (hoverIndex == null) {
      // choose start; or use tgtOrder.length to append
      toIndex = 0;
    } else {
      const len = tgtOrder.length;
      toIndex = Math.max(0, Math.min(hoverIndex, len));
      // 3) Adjust when moving down within same group
      // if (sameGroup && toIndex > fromIndex) toIndex -= 1;
    }

    // 4) Move data on cross-group
    if (!sameGroup) {
      const data = draft[srcGroupId].propertyData[propId];
      delete draft[srcGroupId].propertyData[propId];
      draft[hoverGroupId].propertyData[propId] = data;
    }

    tgtOrder.splice(toIndex, 0, propId);
    if (sameGroup) {
      draft[srcGroupId].propertyOrder = tgtOrder;
    } else {
      draft[hoverGroupId].propertyOrder = tgtOrder;
    }

    updateAllSubTypeGroupDataThunk({
      glossaryId: glossaryId || '',
      type: subType.entryType,
      subTypeId: subType.id,
      groupData: draft,
    });

    setActiveGroup(hoverGroupId);
    setActiveProperty(propId);
    openRelay({
      data: { setActiveGroup: hoverGroupId, setActiveProperty: propId },
      status: 'complete',
    });
  }

  function handleGroupReorder(
    item: { kind: 'group' | 'property'; groupId: string; propertyId?: string },
    hoverIndex: number | null,
    groupId: string
  ) {
    if (item.kind === 'property' && item.propertyId) {
      // drop on group container → insert at start if no hover index
      handlePropertyReorder(
        {
          kind: 'property',
          propertyId: item.propertyId,
          groupId: item.groupId,
        },
        hoverIndex ?? 0,
        groupId
      );
      return;
    }

    // group→group reordering
    const order = Array.from(subType.groupOrder) as string[];
    const from = order.indexOf(item.groupId);
    if (from === -1) return;
    const to = Math.max(0, Math.min(hoverIndex ?? 0, order.length - 1));
    const [g] = order.splice(from, 1);
    order.splice(to, 0, g);

    reorderSubTypeGroupsThunk({
      glossaryId: glossaryId || '',
      type: subType.entryType,
      subTypeId: subType.id,
      newOrder: order,
    });
  }

  const { getPropertyLabel } = usePropertyLabel();

  const handleModeClick = (newMode: 'focus' | 'form' | 'preview') => {
    setMode(newMode);
    openRelay({ data: { setMode: newMode }, status: 'complete' });
  };

  useEffect(() => {
    const groupId = subType?.groupOrder[0] || null;
    const propertyId = subType?.groupData[groupId]?.propertyOrder[0] || null;
    openRelay({
      data: {
        setActiveGroup: groupId || null,
        setActiveProperty: propertyId || null,
      },
      status: 'complete',
    });
    setActiveGroup(groupId);
    setActiveProperty(propertyId);
  }, [subType?.id]);

  useEffect(() => {
    if (subType && activeGroup && activeProperty) {
      const firstGroupId = subType.groupOrder[0] || null;
      if (!subType.groupData?.[activeGroup]) {
        setActiveGroup(firstGroupId);
      }
      if (!subType.groupData?.[activeGroup]?.propertyData[activeProperty]) {
        const firstPropertyId =
          subType.groupData[firstGroupId]?.propertyOrder[0] || null;
        setActiveProperty(firstPropertyId);
      }
    }
  }, [subType, activeGroup, activeProperty]);

  if (!subType) return <Box>No SubType Found</Box>;
  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 3 }}>
        {subType?.name} Properties
      </Typography>
      <Typography variant="caption">{`( ${getPropertyLabel('system', subType.entryType).label} )`}</Typography>
      <Box sx={{ display: 'flex', gap: 0, justifyContent: 'center', mt: 2 }}>
        <IconButton
          size="small"
          sx={{
            color: mode === 'focus' ? 'secondary.light' : 'text.primary',
          }}
          onClick={() => handleModeClick('focus')}
        >
          <CenterFocusStrong fontSize="small" />
        </IconButton>
        <IconButton
          sx={{
            color: mode === 'form' ? 'secondary.light' : 'text.secondary',
          }}
          onClick={() => handleModeClick('form')}
        >
          <Description fontSize="small" />
        </IconButton>
        <IconButton
          sx={{
            color: mode === 'preview' ? 'secondary.light' : 'text.primary',
          }}
          onClick={() => handleModeClick('preview')}
        >
          <Preview fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ maxHeight: 1000, overflowY: 'auto' }}>
        <SubTypePropertyDragProvider>
          <Box sx={{ mb: 2 }}>
            {subType.groupOrder.map((g: string, i: number) => (
              <SidebarGroup
                key={g}
                index={i}
                groupId={g}
                hoverGroup={hoverGroup}
                setHoverGroup={setHoverGroup}
                openRelay={openRelay}
                glossaryId={glossaryId || ''}
                type={subType.entryType}
                subTypeId={editId}
                activeGroup={activeGroup}
                setActiveGroup={setActiveGroup}
                activeProperty={activeProperty}
                setActiveProperty={setActiveProperty}
                mode={mode}
                setGroupHoverIndex={setGroupHoverIndex}
                groupHoverIndex={groupHoverIndex}
                handleGroupReorder={handleGroupReorder}
                setPropertyHoverIndex={setPropertyHoverIndex}
                handlePropertyReorder={handlePropertyReorder}
                propertyHoverIndex={propertyHoverIndex}
                addProperty={addProperty}
              />
            ))}
          </Box>
        </SubTypePropertyDragProvider>
      </Box>
      {subType.groupOrder.length < 5 && (
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          onClick={addGroup}
        >
          Add Group
        </Button>
      )}
    </Box>
  );
};

export default SubTypeSidebarEditor;
