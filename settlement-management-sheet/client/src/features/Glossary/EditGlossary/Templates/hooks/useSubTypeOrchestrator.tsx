import {
  selectSubTypeGroups,
  selectSubTypeProperties,
} from '@/app/selectors/subTypeSelectors.js';
import { SubType, SubTypeGroupLink } from '@/app/slice/subTypeSlice.js';
import { generateFormSource } from '@/features/Glossary/utils/generatePropertyValue.js';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

const useSubTypeOrchestrator = ({ subtype }: { subtype: SubType | null }) => {
  const allGroups = useSelector(selectSubTypeGroups);
  const allProperties = useSelector(selectSubTypeProperties);

  const source = useMemo(() => {
    if (!subtype) return null;
    return generateFormSource(subtype, allGroups, allProperties);
  }, [subtype, allGroups, allProperties]);

  const anchorOptions = useMemo(() => {
    const subtypePropertyList = [] as string[];
    const groupPropertyMap = {} as Record<string, string>;
    if (!subtype) return [];
    subtype.groups.forEach((groupLink: SubTypeGroupLink) => {
      const group = allGroups.find((g) => g.id === groupLink.groupId)!;
      if (!group) throw new Error('Invalid group ID');
      const { properties } = group;
      properties.forEach((propertyLink) => {
        subtypePropertyList.push(propertyLink.propertyId);
        groupPropertyMap[propertyLink.propertyId] = group.name;
      });
    });
    const eligibleAnchors = subtypePropertyList
      .map((propertyId) => {
        const property = allProperties.find((p) => p.id === propertyId)!;
        if (!property) throw new Error('Invalid property ID');
        return {
          label: property.name,
          value: property.id,
          inputType: property.inputType,
          group: groupPropertyMap[propertyId],
        };
      })
      .filter(
        (option) =>
          option.inputType === 'dropdown' ||
          option.inputType === 'range' ||
          option.inputType === 'checkbox'
      );
    return eligibleAnchors;
  }, [subtype, allGroups, allProperties]);

  function verifyAnchorInOptions(anchorId: string | null) {
    if (anchorId === null) return true;
    return anchorOptions.some((option) => option.value === anchorId);
  } // used to reset anchors if the selected property is removed from group / subtype

  useEffect(() => {
    if (!subtype) return;
    if (
      !verifyAnchorInOptions(subtype.anchors?.primary) ||
      !verifyAnchorInOptions(subtype.anchors?.secondary)
    ) {
      console.log('One or more anchors are invalid, resetting to null anchors');
      // dispatch action to reset anchors to null
    }
  }, [subtype, anchorOptions]);

  return {
    source,
    anchorOptions,
    verifyAnchorInOptions,
    allGroups,
    allProperties,
  };
};

export default useSubTypeOrchestrator;
