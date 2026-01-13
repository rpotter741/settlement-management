// import { GenericObject } from '../../../../../shared/types/common.js';
import {
  SubTypeGroup,
  SubTypeGroupLink,
  SubTypeProperty,
  SubTypePropertyLink,
} from '@/app/slice/subTypeSlice.js';
import { v4 as newId } from 'uuid';
// import {
//   SubTypeCompoundData,
//   SubTypeCompoundDefinition,
// } from '../EditGlossary/Templates/components/types.js';

interface GenericObject {
  [key: string]: any;
}

function generatePropertyValue(property: any, propertyId: string) {
  const propertyConfig: any = { id: propertyId, name: property?.name };
  switch (property.inputType) {
    case 'text':
      propertyConfig.value = property?.shape.defaultValue || '';
      break;
    case 'checkbox':
      propertyConfig.value = property?.shape.defaultChecked || false;
      break;
    case 'range':
      propertyConfig.value = 0;
      break;
    case 'dropdown':
      propertyConfig.value = property?.shape.selectType === 'multi' ? [] : '';
      break;
    case 'compound':
      throw new Error('Use generateCompoundPropertyValue for compound types');
    case 'date':
      propertyConfig.value = '';
      break;
    default:
      return null;
  }
  return propertyConfig;
}

export default generatePropertyValue;

export function generateCompoundPropertyValue(
  property: any,
  propertyId: string
): GenericObject {
  const propertyConfig: Partial<GenericObject> = {
    id: propertyId,
    name: property.name,
  };

  if (property.shape?.left?.shape?.defaultList?.length > 0) {
    property.shape.left.shape.defaultList.forEach((option: string) => {
      const id = newId();
      const leftId = newId();
      const rightId = newId();
      const leftValue = generatePropertyValue(property.shape.left, leftId);
      leftValue.value = option;
      propertyConfig.order = propertyConfig.order
        ? [...propertyConfig.order, id]
        : [id];
      propertyConfig.value = {
        ...(propertyConfig.value || {}),
        [id]: {
          left: leftValue,
          right: generatePropertyValue(property.shape.right, rightId),
        },
      };
    });
  } else {
    const rowId = newId();
    const leftId = newId();
    const rightId = newId();
    propertyConfig.order = [rowId];
    propertyConfig.value = {
      [rowId]: {
        left: generatePropertyValue(property.shape.left, leftId),
        right: generatePropertyValue(property.shape.right, rightId),
      },
    };
  }

  return propertyConfig as GenericObject;
}

const sectionOrDetail = (entryType: string) => {
  if (
    entryType === 'event' ||
    entryType === 'person' ||
    entryType === 'lore' ||
    entryType === 'location' ||
    entryType === 'item'
  ) {
    return 'detail';
  }
  return 'section';
};

export function generateFormSource(
  subType: any,
  groups: SubTypeGroup[],
  allProperties: SubTypeProperty[]
): { groups: any; [key: string]: any } {
  if (Object.keys(subType).length === 0) return { groups: null };
  const formSource: GenericObject & { groups: GenericObject } = {
    name: 'New Entry',
    format: sectionOrDetail(subType.entryType),
    entryType: subType.entryType,
    groups: {},
    primaryAnchorId: subType.anchors?.primary || null,
    secondaryAnchorId: subType.anchors?.secondary || null,
    primaryAnchorValue: '',
    secondaryAnchorValue: '',
  };
  subType.groups.forEach((groupLink: SubTypeGroupLink) => {
    const group = groups.find((g) => g.id === groupLink.groupId)!;
    if (!group) throw new Error('Invalid group ID');
    formSource.groups[group.id] = {
      name: group.displayName,
      id: group.id,
      properties: {},
    };
    const { properties } = group;
    properties.forEach((propertyLink: SubTypePropertyLink) => {
      const property = allProperties.find(
        (p) => p.id === propertyLink.propertyId
      )!;
      if (!property) throw new Error('Invalid property ID');
      const isCompound = property.inputType === 'compound';
      if (isCompound) {
        formSource.groups[group.id].properties[property.id] =
          generateCompoundPropertyValue(property, property.id);
      } else {
        formSource.groups[group.id].properties[property.id] =
          generatePropertyValue(property, property.id);
      }
    });
  });
  return formSource;
}
