import { useRelayChannel } from '@/hooks/global/useRelay.js';
import { cloneDeep, get, set } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGeneratedSource } from './useGeneratedFormSource.js';
import addSubTypeThunk from '@/app/thunks/glossary/subtypes/addSubTypeThunk.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';
import useTheming from '@/hooks/layout/useTheming.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import { useDispatch } from 'react-redux';
import { generateCompoundPropertyValue } from '@/features/Glossary/utils/generatePropertyValue.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { useSelector } from 'react-redux';
import {
  selectSubTypeById,
  selectSubTypeGroups,
} from '@/app/selectors/subTypeSelectors.js';

const useTemplateManager = () => {
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
  const [mode, setMode] = useState<SubTypeModes>(
    ui?.subType?.mode || 'property'
  );
  const scrolling = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleData = useCallback(
    (data: any) => {
      if (data.subType !== undefined) {
        setSubTypeId(data.subType.id);
      }
      if (data?.setActiveGroup !== undefined) {
        setActiveGroup(data.setActiveGroup);
      }
      if (data?.setActiveProperty !== undefined) {
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
      if (data?.setMode !== undefined) {
        setMode(data.setMode);
      }
      if (data?.clearId) {
        setSubTypeId(null);
      }
      if (data.propertyId) {
        setActiveProperty(data.propertyId);
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

  const subtype = useSelector(selectSubTypeById(subTypeId || ''));

  // const { source, setSource } = useGeneratedSource(subType);

  // const handleChange = (value: any, keypath: string) => {
  //   const newSource = cloneDeep(source);
  //   set(newSource, keypath, value);
  //   setSource(newSource);
  // };

  const { openRelay } = useRelayChannel({
    id: 'subType-sidebar-template',
    onComplete: handleData,
  });

  // useEffect(() => {
  //   if (subType && activeGroup && activeProperty) {
  //     const firstGroupId = subType.groupOrder[0] || null;
  //     if (!firstGroupId) return;
  //     if (!subType.groupData?.[activeGroup]) {
  //       setActiveGroup(firstGroupId);
  //     }
  //     if (!subType.groupData?.[activeGroup]?.propertyData[activeProperty]) {
  //       const firstPropertyId =
  //         subType.groupData[firstGroupId]?.propertyOrder[0] || null;
  //       setActiveProperty(firstPropertyId);
  //     }
  //   }
  // }, [subType, activeGroup, activeProperty]);

  // const semanticAnchors = useMemo(() => {
  //   const anchors =
  //     subType?.groupOrder.map((g: any) =>
  //       subType.groupData[g].propertyOrder.map((p: any) => {
  //         const property = subType.groupData[g].propertyData[p];
  //         if (property.type === 'dropdown') {
  //           return {
  //             name: property?.name,
  //             id: `groups.${g}.properties.${p}`,
  //           };
  //         }
  //         if (property.type === 'compound') {
  //           if (property.left.type === 'dropdown') {
  //             return {
  //               name: property.name,
  //               id: `groups.${g}.properties.${p}.left`,
  //             };
  //           }
  //         }
  //         if (property.type === 'range') {
  //           return {
  //             name: property?.name,
  //             id: `groups.${g}.properties.${p}`,
  //           };
  //         }
  //       })
  //     ) || [];
  //   return anchors.flat().filter((a) => a !== undefined);
  // }, [subType]);

  const deselectGroup = useCallback(() => {
    setActiveGroup(null);
    openRelay({
      data: { setActiveGroup: null, setMode: 'group' },
      status: 'complete',
    });
  }, [openRelay]);

  const handleAnchorChange = (e: string, key: 'primary' | 'secondary') => {
    // updateSubTypeAnchorThunk({
    //   anchor: key,
    //   value: e,
    //   subTypeId: subTypeId || '',
    // });
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

  // useEffect(() => {
  //   if (!subType) return;
  //   if (!activeProperty && !activeGroup) {
  //     setActiveGroup(subType.groupOrder[0] || null);
  //     setActiveProperty(
  //       subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null
  //     );
  //     openRelay({
  //       data: {
  //         setActiveGroup: subType.groupOrder[0] || null,
  //         setActiveProperty:
  //           subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null,
  //       },
  //       status: 'complete',
  //     });
  //     return;
  //   }
  //   if (!activeGroup && activeProperty) {
  //     setActiveGroup(subType.groupOrder[0] || null);
  //     openRelay({
  //       data: { setActiveGroup: subType.groupOrder[0] || null },
  //       status: 'complete',
  //     });
  //     return;
  //   }
  //   if (!activeProperty && activeGroup) {
  //     setActiveProperty(
  //       subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null
  //     );
  //     openRelay({
  //       data: {
  //         setActiveProperty:
  //           subType.groupData[subType.groupOrder[0]]?.propertyOrder[0] || null,
  //       },
  //       status: 'complete',
  //     });
  //     return;
  //   }
  // }, [subType, activeGroup, activeProperty]);

  const groups = useSelector(selectSubTypeGroups);
  const group = useMemo(() => {
    return groups.find((g) => g.id === activeGroup) || null;
  }, [groups, activeGroup]);

  // const allProperties = useMemo(() => {
  //   if (!subType) return {};
  //   return subType.groupOrder.reduce(
  //     (acc: Record<string, string[]>, groupId: string) => {
  //       return { ...acc, [groupId]: subType.groupData[groupId].propertyOrder };
  //     },
  //     {}
  //   );
  // }, [subType?.groupOrder, subType]);

  // const hasMultipleProperties = useMemo(() => {
  //   if (!subType) return false;
  //   return subType.groupOrder.some(
  //     (groupId: string) => subType.groupData[groupId].propertyOrder.length > 1
  //   );
  // }, [subType]);

  // useEffect(() => {
  //   if (!activeGroup) return;
  //   if (!subType) return;

  //   const groups = allGroups;
  //   const groupIndex = groups.indexOf(activeGroup);
  //   if (groupIndex === -1) return;

  //   const properties = allProperties[activeGroup] || [];
  //   const propertyIndex = properties.indexOf(activeProperty || '');

  //   function getPropertyName(gId: string, pIndex: number) {
  //     const pId = allProperties[gId]?.[pIndex];
  //     return {
  //       gId,
  //       pId,
  //       name:
  //         subType!.groupData[gId]?.propertyData[pId]?.name ||
  //         subType!.groupData[gId]?.name ||
  //         'Unnamed',
  //     };
  //   }

  //   function findNextGroupWithProps(startIdx: number, direction: 1 | -1) {
  //     let idx = startIdx;
  //     for (let i = 0; i < groups.length; i++) {
  //       idx = (idx + direction + groups.length) % groups.length;
  //       const props = allProperties[groups[idx]] || [];
  //       if (props.length > 0) {
  //         return { groupId: groups[idx], props };
  //       }
  //     }
  //     return null;
  //   }

  //   // If we're in 'form' mode, navigate by group (show previous/next group)
  //   if (mode === 'group' || !activeProperty) {
  //     const prevGroup = findNextGroupWithProps(groupIndex, -1);
  //     const nextGroup = findNextGroupWithProps(groupIndex, 1);

  //     const prevLabel = prevGroup
  //       ? {
  //           name: subType.groupData[prevGroup.groupId]?.name || 'Unnamed Group',
  //           pId: prevGroup.props[0] || null,
  //           gId: prevGroup.groupId,
  //         }
  //       : null;

  //     const nextLabel = nextGroup
  //       ? {
  //           name: subType.groupData[nextGroup.groupId]?.name || 'Unnamed Group',
  //           pId: nextGroup.props[0] || null,
  //           gId: nextGroup.groupId,
  //         }
  //       : null;

  //     setPreviousLabel(prevLabel);
  //     setNextLabel(nextLabel);
  //     return;
  //   }

  //   // Default 'focus' mode behavior: navigate by property
  //   if (!activeProperty) {
  //     setPreviousLabel(null);
  //     setNextLabel(null);
  //     return;
  //   }

  //   let prevLabel: {
  //     name: string | null;
  //     pId: string | null;
  //     gId: string | null;
  //   } | null = null;
  //   if (propertyIndex > 0) {
  //     // Previous property in the same group
  //     prevLabel = getPropertyName(activeGroup, propertyIndex - 1);
  //   } else if (groups.length > 0) {
  //     // Find previous group with properties
  //     const prevGroup = findNextGroupWithProps(groupIndex, -1);
  //     if (prevGroup) {
  //       prevLabel = getPropertyName(
  //         prevGroup.groupId,
  //         prevGroup.props.length - 1
  //       );
  //     }
  //   }
  //   setPreviousLabel(prevLabel);

  //   let nextLabel: {
  //     name: string | null;
  //     pId: string | null;
  //     gId: string | null;
  //   } | null = null;
  //   if (propertyIndex < properties.length - 1) {
  //     // Next property in the same group
  //     nextLabel = getPropertyName(activeGroup, propertyIndex + 1);
  //   } else if (groups.length > 0) {
  //     // Find next group with properties
  //     const nextGroup = findNextGroupWithProps(groupIndex, 1);
  //     if (nextGroup) {
  //       nextLabel = getPropertyName(nextGroup.groupId, 0);
  //     }
  //   }
  //   setNextLabel(nextLabel);
  // }, [activeGroup, activeProperty, allGroups, allProperties, subType, mode]);

  // const onAddData = useCallback(
  //   (sourceProperty: any, groupId: string, propertyId: string) => {
  //     //@ts-ignore
  //     const newData = generateCompoundPropertyValue(sourceProperty, propertyId);
  //     const addition = newData.value[newData.order[0]];
  //     const newSource = cloneDeep(source);
  //     const targetProperty = get(
  //       newSource,
  //       `groups.${groupId}.properties.${propertyId}`
  //     );
  //
  //     if (!targetProperty) return;
  //     targetProperty.value = {
  //       ...targetProperty.value,
  //       [newData.order[0]]: addition,
  //     };
  //     targetProperty.order = [
  //       ...(targetProperty.order || []),
  //       newData.order[0],
  //     ];
  //     set(
  //       newSource,
  //       `groups.${groupId}.properties.${propertyId}`,
  //       targetProperty
  //     );
  //     setSource(newSource);
  //   },
  //   [source]
  // );

  // const onRemove = useCallback(
  //   (sourceId: string, keypath: string) => {
  //     const newSource = cloneDeep(source);
  //     const items = get(newSource, keypath);
  //     if (!items) return;
  //     const newItems = { ...items };
  //     delete newItems.value[sourceId];
  //     newItems.order = newItems.order.filter((id: string) => id !== sourceId);
  //     set(newSource, keypath, newItems);
  //     setSource(newSource);
  //   },
  //   [source]
  // );

  return {
    subTypeId,
    subtype,
    // source,
    mode,
    setMode,
    activeGroup,
    setActiveGroup,
    activeProperty,
    setActiveProperty,
    previousLabel,
    nextLabel,
    // hasMultipleProperties,
    getPropertyLabel,
    getHexValue,
    // handleChange,
    updateActiveGroupProperty,
    handleAnchorChange,
    activeId,
    // setSource,
    dispatch,
    // semanticAnchors,
    scrolling,
    // onAddData,
    // onRemove,
    group,
    deselectGroup,
  };
};

export default useTemplateManager;
