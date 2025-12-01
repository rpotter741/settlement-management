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
  console.log(property);
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
      propertyConfig.value = {
        left: generatePropertyValue(property?.shape.left, property.left.id),
        right: generatePropertyValue(property?.shape.right, property.right.id),
      };
      break;
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
  if (property.shape.left?.shape.defaultList?.length > 0) {
    {
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
    }
  } else {
    const id = newId();
    const leftId = newId();
    const rightId = newId();
    propertyConfig.order = [id];
    propertyConfig.value = {
      [id]: {
        left: generatePropertyValue(property.shape.left, leftId),
        right: generatePropertyValue(property.shape.right, rightId),
      },
    };
  }

  console.log(propertyConfig);

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
    return 'section';
  }
  return 'detail';
};

export function generateFormSource(
  subType: any,
  groups: SubTypeGroup[],
  allProperties: SubTypeProperty[]
): { [key: string]: any } {
  if (Object.keys(subType).length === 0) return {};
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
        console.log('generating compound for', property);
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
