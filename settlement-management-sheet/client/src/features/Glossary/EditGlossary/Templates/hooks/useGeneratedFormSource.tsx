import { generateFormSource } from '@/features/Glossary/utils/generatePropertyValue.js';
import { cloneDeep, isEqual } from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';

export function useGeneratedSource(subType: any) {
  const lastSubTypeRef = useRef<{
    generated: any;
    signature: string | null;
  } | null>(null);
  const [source, setSource] = useState<any>(generateFormSource(subType || {}));

  // create a hashable signature of the structure
  const structureSignature = useMemo(() => {
    if (!subType) return null;

    // const minimalDefinition = subType.groupOrder.map((gId: string) => {
    //   const group = subType.groupData[gId];
    //   return {
    //     groupId: gId,
    //     propertyOrder: group.propertyOrder,
    //     propertyShapes: group.propertyOrder.map((pId: string) => {
    //       const prop = group.propertyData[pId];
    //       return {
    //         id: pId,
    //         type: prop.type,
    //         inputType: prop.inputType,
    //         selectType: prop.selectType,
    //         optionType: prop.optionType,
    //         left: prop.left,
    //         right: prop.right,
    //         options: prop.options,
    //         // add other relevant structural keys as needed
    //         // include only keys that define *structure*, not user-facing metadata
    //         // add/remove as needed for your model
    //       };
    //     }),
    //   };
    // });
    return JSON.stringify({});
  }, [subType]);

  // only regenerate when the *structure* actually changes
  const generated = useMemo(() => {
    if (!subType) return null;
    const lastSubType = lastSubTypeRef.current;

    // shallow check – if structure didn’t change, reuse previous generated
    if (lastSubType && isEqual(structureSignature, lastSubType.signature)) {
      return lastSubType.generated;
    }

    // structure changed – regenerate
    const newGenerated = generateFormSource(subType);
    lastSubTypeRef.current = {
      generated: newGenerated,
      signature: structureSignature,
    };
    return newGenerated;
  }, [subType, structureSignature]);

  // now merge and persist only if different
  useEffect(() => {
    if (!generated) return;

    const merged = cloneDeep(generated);
    if (source && Object.keys(source).length > 0) {
      subType.groupOrder.forEach((gId: string) => {
        subType.groupData[gId].propertyOrder.forEach((pId: string) => {
          const existing = source?.groups?.[gId]?.properties?.[pId];
          const generatedProp = merged?.groups?.[gId]?.properties?.[pId];
          if (existing && generatedProp) {
            const existingKeys = Object.keys(existing).sort();
            const generatedKeys = Object.keys(generatedProp).sort();
            const keysMatch =
              existingKeys.length === generatedKeys.length &&
              existingKeys.every((k, i) => k === generatedKeys[i]);
            if (keysMatch && !existing.order)
              merged.groups[gId].properties[pId] = existing;
          }
        });
      });
    }

    if (!isEqual(source, merged)) setSource(merged);
  }, [generated]);
  return { source, setSource };
}
