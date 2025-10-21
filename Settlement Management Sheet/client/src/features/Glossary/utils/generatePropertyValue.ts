import { GenericObject } from '../../../../../shared/types/common.js';
import { v4 as newId } from 'uuid';
import {
  SubTypeCompoundData,
  SubTypeCompoundDefinition,
} from '../EditGlossary/Templates/components/types.js';

function generatePropertyValue(property: any, propertyId: string) {
  const propertyConfig: any = { id: propertyId, name: property?.name };
  switch (property.type) {
    case 'text':
      propertyConfig.value = property?.defaultValue || '';
      break;
    case 'checkbox':
      propertyConfig.value = property?.defaultChecked || false;
      break;
    case 'range':
      propertyConfig.value = 0;
      break;
    case 'dropdown':
      propertyConfig.value = property.selectType === 'multi' ? [] : '';
      break;
    case 'compound':
      propertyConfig.value = {
        left: generatePropertyValue(property.left, property.left.id),
        right: generatePropertyValue(property.right, property.right.id),
      };
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
): SubTypeCompoundData {
  const propertyConfig: Partial<SubTypeCompoundData> = {
    id: propertyId,
    name: property.name,
  };
  const id = newId();
  propertyConfig.order = [id];
  propertyConfig.value = {
    [id]: {
      left: generatePropertyValue(property.left, property.left.id),
      right: generatePropertyValue(property.right, property.right.id),
    },
  };

  return propertyConfig as SubTypeCompoundData;
}

const sectionOrDetail = (entryType: string) => {
  if (
    entryType !== 'event' &&
    entryType !== 'person' &&
    entryType !== 'note' &&
    entryType !== 'location' &&
    entryType !== 'item'
  ) {
    return 'section';
  }
  return 'detail';
};

export function generateFormSource(subType: any) {
  const formSource: GenericObject & { groups: GenericObject } = {
    name: 'New Entry',
    format: sectionOrDetail(subType.entryType),
    entryType: subType.entryType,
    groups: {},
  };
  subType.groupOrder.forEach((groupId: string) => {
    const group = subType.groupData[groupId];
    const groupData: GenericObject = {
      id: groupId,
      name: group.name,
      properties: {},
    };
    group.propertyOrder.forEach((propertyId: string) => {
      const property = group.propertyData[propertyId];
      if (property.type === 'compound') {
        //@ts-ignore
        groupData.properties[propertyId] = generateCompoundPropertyValue(
          property,
          propertyId
        );
      } else {
        //@ts-ignore
        groupData.properties[propertyId] = generatePropertyValue(
          property,
          propertyId
        );
      }
    });
    formSource.groups[groupId] = groupData;
  });
  return formSource;
}
