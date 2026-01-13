import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRelayChannel } from '@/hooks/global/useRelay.js';
import useSubTypeEditor from '@/hooks/glossary/useSubTypeEditor.js';
import { useDispatch } from 'react-redux';
import FocusOrchestrator from './components/FocusOrchestrator.js';
import FormOrchestrator from './components/FormOrchestrator.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { updateSubTypeName } from '@/app/slice/subTypeSlice.js';
import { glossaryEntryTypeOptions } from '../../../../../../shared/types/index.js';
import { usePropertyLabel } from '../../utils/getPropertyLabel.js';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import PreviewOrchestrator from './components/PreviewOrchestrator.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import addSubTypeThunk from '@/app/thunks/glossary/subtypes/addSubTypeThunk.js';
import updateSubTypeAnchorThunk from '@/app/thunks/glossary/subtypes/updateSubTypeAnchorThunk.js';

const SubTypeManager = () => {
  const dispatch = useDispatch();
  const { ui, activeId } = useGlossaryEditor();
  const [subTypeId, setSubTypeId] = useState<string | null>(
    ui?.subType?.editId || null
  );
  const { getHexValue } = useTheming();

  const { getPropertyLabel } = usePropertyLabel();

  const [previousLabel, setPreviousLabel] = useState<{
    name: string | null;
    pId: string | null;
    gId: string | null;
  } | null>(null);
  const [nextLabel, setNextLabel] = useState<{
    name: string | null;
    pId: string | null;
    gId: string | null;
  } | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(
    ui?.subType?.activeGroup || null
  );
  const [activeProperty, setActiveProperty] = useState<string | null>(
    ui?.subType?.activeProperty || null
  );
  const [mode, setMode] = useState<'focus' | 'form' | 'preview'>(
    ui?.subType?.mode || 'focus'
  );
  const scrolling = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleData = useCallback(
    (data: any) => {
      if (data.subType) {
        addSubTypeThunk({
          subType: data.subType,
          setSubTypeId,
        });
      }
      if (data?.setActiveGroup) {
        setActiveGroup(data.setActiveGroup);
      }
      if (data?.setActiveProperty) {
        setActiveProperty(data.setActiveProperty);
        const el = document.getElementById(
          'property_' +
            data.setActiveProperty +
            '_' +
            (data.setActiveGroup || activeGroup)
        );
        if (el) {
          scrolling.current = true;
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(() => {
            scrolling.current = false;
          }, 1000);
        }
      }
      if (data?.setMode) {
        setMode(data.setMode);
      }
    },
    [
      activeGroup,
      setActiveGroup,
      setActiveProperty,
      setMode,
      scrolling,
      activeId,
    ]
  );

  const { subType } = useSubTypeEditor(subTypeId || '');
  const { openRelay } = useRelayChannel({
    id: 'subType-sidebar-template',
    onComplete: handleData,
  });

  useEffect(() => {
    if (subType && activeGroup && activeProperty) {
      const firstGroupId = subType.groupOrder[0] || null;
      if (!firstGroupId) return;
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

  const semanticAnchors = useMemo(() => {
    const anchors =
      subType?.groupOrder.map((g: any) =>
        subType.groupData[g].propertyOrder.map((p: any) => ({
          name: subType.groupData[g].propertyData[p]?.name,
          id: p,
        }))
      ) || [];
    return anchors.flat();
  }, [subType]);

  const handleAnchorChange = (e: string, key: 'primary' | 'secondary') => {
    updateSubTypeAnchorThunk({
      anchor: key,
      value: e,
      subTypeId: subTypeId || '',
    });
  };

  const updateActiveGroupProperty = useCallback(
    (propertyId: string | null, groupId: string) => {
      if (activeGroup !== groupId) {
        openRelay({
          data: { setActiveGroup: groupId, setActiveProperty: propertyId },
          status: 'complete',
        });
        setActiveGroup(groupId);
        setActiveProperty(propertyId);
      } else {
        openRelay({
          data: { setActiveProperty: propertyId },
          status: 'complete',
        });
        setActiveProperty(propertyId);
      }
    },
    [activeGroup, openRelay, setActiveGroup, setActiveProperty]
  );

  useEffect(() => {
    if (!subType) return;
    if (!activeProperty && !activeGroup) {
      setActiveGroup(subType.groupOrder[0] || null);
      setActiveProperty(
        subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null
      );
      openRelay({
        data: {
          setActiveGroup: subType.groupOrder[0] || null,
          setActiveProperty:
            subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null,
        },
        status: 'complete',
      });
      return;
    }
    if (!activeGroup && activeProperty) {
      setActiveGroup(subType.groupOrder[0] || null);
      openRelay({
        data: { setActiveGroup: subType.groupOrder[0] || null },
        status: 'complete',
      });
      return;
    }
    if (!activeProperty && activeGroup) {
      setActiveProperty(
        subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null
      );
      openRelay({
        data: {
          setActiveProperty:
            subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null,
        },
        status: 'complete',
      });
      return;
    }
  }, [subType, activeGroup, activeProperty]);

  const allGroups = useMemo(() => {
    if (!subType) return [];
    return subType.groupOrder;
  }, [subType?.groupOrder]);

  const allProperties = useMemo(() => {
    if (!subType) return {};
    return subType.groupOrder.reduce(
      (acc: Record<string, string[]>, groupId: string) => {
        return { ...acc, [groupId]: subType.groupData[groupId].propertyOrder };
      },
      {}
    );
  }, [subType?.groupOrder, subType]);

  const hasMultipleProperties = useMemo(() => {
    if (!subType) return false;
    return subType.groupOrder.some(
      (groupId: string) => subType.groupData[groupId].propertyOrder.length > 1
    );
  }, [subType]);

  useEffect(() => {
    if (!activeGroup) return;
    if (!subType) return;

    const groups = allGroups;
    const groupIndex = groups.indexOf(activeGroup);
    if (groupIndex === -1) return;

    const properties = allProperties[activeGroup] || [];
    const propertyIndex = properties.indexOf(activeProperty || '');

    function getPropertyName(gId: string, pIndex: number) {
      const pId = allProperties[gId]?.[pIndex];
      return {
        gId,
        pId,
        name:
          subType!.groupData[gId]?.propertyData[pId]?.name ||
          subType!.groupData[gId]?.name ||
          'Unnamed',
      };
    }

    function findNextGroupWithProps(startIdx: number, direction: 1 | -1) {
      let idx = startIdx;
      for (let i = 0; i < groups.length; i++) {
        idx = (idx + direction + groups.length) % groups.length;
        const props = allProperties[groups[idx]] || [];
        if (props.length > 0) {
          return { groupId: groups[idx], props };
        }
      }
      return null;
    }

    // If we're in 'form' mode, navigate by group (show previous/next group)
    if (mode === 'form' || !activeProperty) {
      const prevGroup = findNextGroupWithProps(groupIndex, -1);
      const nextGroup = findNextGroupWithProps(groupIndex, 1);

      const prevLabel = prevGroup
        ? {
            name: subType.groupData[prevGroup.groupId]?.name || 'Unnamed Group',
            pId: prevGroup.props[0] || null,
            gId: prevGroup.groupId,
          }
        : null;

      const nextLabel = nextGroup
        ? {
            name: subType.groupData[nextGroup.groupId]?.name || 'Unnamed Group',
            pId: nextGroup.props[0] || null,
            gId: nextGroup.groupId,
          }
        : null;

      setPreviousLabel(prevLabel);
      setNextLabel(nextLabel);
      return;
    }

    // Default 'focus' mode behavior: navigate by property
    if (!activeProperty) {
      setPreviousLabel(null);
      setNextLabel(null);
      return;
    }

    let prevLabel: {
      name: string | null;
      pId: string | null;
      gId: string | null;
    } | null = null;
    if (propertyIndex > 0) {
      // Previous property in the same group
      prevLabel = getPropertyName(activeGroup, propertyIndex - 1);
    } else if (groups.length > 0) {
      // Find previous group with properties
      const prevGroup = findNextGroupWithProps(groupIndex, -1);
      if (prevGroup) {
        prevLabel = getPropertyName(
          prevGroup.groupId,
          prevGroup.props.length - 1
        );
      }
    }
    setPreviousLabel(prevLabel);

    let nextLabel: {
      name: string | null;
      pId: string | null;
      gId: string | null;
    } | null = null;
    if (propertyIndex < properties.length - 1) {
      // Next property in the same group
      nextLabel = getPropertyName(activeGroup, propertyIndex + 1);
    } else if (groups.length > 0) {
      // Find next group with properties
      const nextGroup = findNextGroupWithProps(groupIndex, 1);
      if (nextGroup) {
        nextLabel = getPropertyName(nextGroup.groupId, 0);
      }
    }
    setNextLabel(nextLabel);
  }, [activeGroup, activeProperty, allGroups, allProperties, subType, mode]);

  if (subType && mode === 'preview') {
    return (
      <PreviewOrchestrator
        subType={subType}
        glossaryId={activeId}
        mode={mode}
        editId={subTypeId!}
      />
    );
  }

  return (
    <GlossaryMainWrapper>
      {subType ? (
        <Box
          sx={{
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            px: 4,
            overflow: 'scroll',
            background: `linear-gradient(to right bottom, ${getHexValue({ color: 'background', key: 'paper' })} 50%, ${getHexValue({ color: 'background', key: 'default' })} 100%)`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              py: 4,
              justifyContent: 'space-between',
              gap: 2,
              width: '100%',
              flexDirection: 'column',
              position: mode === 'focus' ? 'relative' : 'sticky',
              top: 0,
              bgcolor: 'background.paper',
              zIndex: 10,
              maxWidth: 800,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'start', xl: 'center' },
                gap: 2,
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <TextField
                  label="Sub-Type Name"
                  sx={{ width: '50%' }}
                  value={subType.name}
                  onChange={(e) => {
                    dispatch(
                      updateSubTypeName({
                        subTypeId: subTypeId || '',
                        name: e.target.value,
                      })
                    );
                  }}
                />
                <>
                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel id="entry-type-label">Entry Type</InputLabel>
                    <Select
                      labelId="entry-type-label"
                      sx={{ width: '100%' }}
                      value={subType.entryType}
                      onChange={(e) => {
                        dispatch(
                          updateSubTypeName({
                            subTypeId: subTypeId || '',
                            name: subType.name,
                          })
                        );
                      }}
                      label="Entry Type"
                    >
                      {glossaryEntryTypeOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {getPropertyLabel(option).label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: { xs: 'start', xl: 'center' },
                }}
              >
                <FormControl>
                  <InputLabel id="semantic-anchors-label-1" size="small">
                    Semantic Anchor 1
                  </InputLabel>
                  <Select
                    sx={{
                      width: [100, 200, 200, 390],
                      textWrap: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      textAlign: 'start',
                    }}
                    size="small"
                    onChange={(e) =>
                      handleAnchorChange(e.target.value as string, 'primary')
                    }
                    value={subType.anchors.primary || ''}
                    label="Semantic Anchor 1"
                  >
                    {semanticAnchors.map(
                      (anchor: { name: string; id: string }) => {
                        if (subType.anchors.secondary === anchor.id)
                          return null;
                        return (
                          <MenuItem
                            key={anchor.id}
                            value={anchor.id}
                            sx={{ textWrap: 'nowrap', textAlign: 'start' }}
                          >
                            {anchor.name}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id="semantic-anchors-label-1" size="small">
                    Semantic Anchor 2
                  </InputLabel>

                  <Select
                    sx={{
                      width: [100, 200, 200, 390],
                      textWrap: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      textAlign: 'start',
                    }}
                    size="small"
                    onChange={(e) =>
                      handleAnchorChange(e.target.value as string, 'secondary')
                    }
                    value={subType.anchors.secondary || ''}
                    label="Semantic Anchor 2"
                  >
                    {semanticAnchors.map(
                      (anchor: { name: string; id: string }) => {
                        if (subType.anchors.primary === anchor.id) return null;
                        return (
                          <MenuItem
                            key={anchor.id}
                            value={anchor.id}
                            sx={{ textWrap: 'nowrap', textAlign: 'start' }}
                          >
                            {anchor.name}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxHeight: 36,
                minHeight: 36,
                maxWidth: '800px',
              }}
            >
              {hasMultipleProperties && (
                <>
                  <Button
                    onClick={() =>
                      updateActiveGroupProperty(
                        previousLabel?.pId || null,
                        previousLabel?.gId || ''
                      )
                    }
                  >
                    <ArrowLeft /> {previousLabel?.name}
                  </Button>
                  <Button
                    onClick={() =>
                      updateActiveGroupProperty(
                        nextLabel?.pId || null,
                        nextLabel?.gId || ''
                      )
                    }
                  >
                    {nextLabel?.name} <ArrowRight />
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            {mode === 'focus' ? (
              <FocusOrchestrator
                subTypeId={subTypeId || ''}
                groupId={activeGroup || ''}
                propertyId={activeProperty || ''}
                type={subType.entryType}
                glossaryId={activeId}
                mode={mode}
              />
            ) : mode === 'form' ? (
              <FormOrchestrator
                subTypeId={subTypeId || ''}
                type={subType.entryType}
                glossaryId={activeId}
                mode={mode}
                activeProperty={activeProperty}
                activeGroup={activeGroup}
                updateActiveGroupProperty={updateActiveGroupProperty}
                scrolling={scrolling}
              />
            ) : null}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          No Sub-Type Selected
        </Box>
      )}
    </GlossaryMainWrapper>
  );
};

export default SubTypeManager;

/*
We'll have the tabbed display (lol always) with the generic 'groups'. Tabs can be renamed and reordered, and up to 5 can exist. Side panel might have something to do with it, we'll see. Anyway!

Each tab will have a list of properties, each can be named, given an input type, and then have config options depending on the input type.

Definitely going to use sidebar for navigation here so that each one can be easily accessed. There will be a 'preview' mode where they can see what it looks like to the user (probably a toggle in the side bar -- maybe it's width will be adjusted! Thank to the store, that should be pretty easy (maybe 400 instead of 300 -- sorry tablet users)).
*/
