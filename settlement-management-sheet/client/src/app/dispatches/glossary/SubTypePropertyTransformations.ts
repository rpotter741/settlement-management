import { GenericObject } from '../../../../../shared/types/index.js';
import { SubTypeGroup, SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { SubTypePropertyTypes } from '@/features/Glossary/EditGlossary/Templates/generics/genericContinent.js';
import isAdmin from '@/utility/isAdmin.js';
import { v4 as newId } from 'uuid';

export function createDefaultProperty(
  type: SubTypePropertyTypes,
  name: string,
  propertyId: string
): SubTypeProperty | null {
  let property: SubTypeProperty = {
    name,
    shape: {},
    id: propertyId,
    inputType: type,
    version: 1,
    isAnchor: false,
  };
  let shape: GenericObject = {};
  switch (type) {
    case 'text':
      shape.inputType = 'text';
      shape.defaultValue = '';
      shape.textTransform = 'none';
      break;
    case 'date':
      break;
    case 'dropdown':
      shape.selectType = 'single';
      shape.optionType = 'list';
      shape.defaultList = [];
      shape.options = [];
      shape.isCompound = false;
      break;
    case 'checkbox':
      shape.defaultChecked = false;
      break;
    case 'range':
      shape.isNumber = true;
      shape.min = 0;
      shape.max = 0;
      shape.step = 1;
      shape.label = '';
      break;
    case 'compound':
      shape.left = {
        id: newId(),
        name: 'New Select',
        inputType: 'dropdown',
        shape: {
          selectType: 'single',
          optionType: 'entryType',
          relationship: [],
        },
      };
      shape.right = {
        id: newId(),
        name: 'New Text',
        inputType: 'text',
        shape: {
          inputType: 'text',
          defaultValue: '',
        },
      };
      break;
    default:
      return null;
  }

  property.shape = shape;

  return property as SubTypeProperty;
}

export function createDefaultGroup(
  name: string,
  groupId: string
): SubTypeGroup {
  //@ts-ignore
  return {
    id: groupId,
    name,
    description: '',
    version: 1,
    contentType: isAdmin([]) ? 'system' : 'custom',
    displayName: name,
    display: {},
  };
}

export function transformTextInputType(oldProperty: any): GenericObject | null {
  if (!oldProperty) return null;
  const base = {
    name: oldProperty.name ?? '',
    inputType: 'text' as const,
    shape: {
      inputType: oldProperty.shape.inputType ?? 'text',
    },
    id: oldProperty.id ?? newId(),
  };
  if (oldProperty.shape.inputType === 'number') {
    return {
      ...base,
      shape: { ...base.shape, defaultValue: 0, minValue: 0, maxValue: 0 },
    };
  }
  if (oldProperty.shape.inputType === 'text') {
    return {
      ...base,
      shape: { ...base.shape, defaultValue: '', textTransform: 'none' },
    };
  }
  if (oldProperty.shape.inputType === 'richtext') {
    return {
      ...base,
    };
  }
  return null;
}

export function transformDropDownInputType(
  oldProperty: any
): SubTypeProperty | null {
  if (!oldProperty) return null;

  console.log(oldProperty, 'oldProperty');

  const base = {
    name: oldProperty.name ?? '',
    inputType: 'dropdown' as const,
    id: oldProperty.id ?? newId(),
    shape: {
      selectType: oldProperty.shape.selectType ?? 'single',
      optionType: oldProperty.shape.optionType ?? 'list',
      isCompound: oldProperty.shape.isCompound ?? false,
    },
  };

  const property: SubTypeProperty = { ...base };

  // Add-on modifiers
  if (base.shape.selectType === 'multi') {
    property.maxSelections = oldProperty.maxSelections ?? 3;
  }

  if (base.shape.optionType === 'entryType') {
    console.log('adding relationship');
    property.shape.relationship =
      oldProperty.shape.relationship && oldProperty.shape.relationship.length
        ? []
        : [];
  } else if (base.shape.optionType === 'list') {
    property.shape.options = oldProperty.options ?? [];
    property.shape.defaultList = oldProperty.defaultList ?? [];
  }
  return property;
}

export function transformRangeInputType(
  oldProperty: any
): SubTypeProperty | null {
  if (!oldProperty) return null;
  const base = {
    name: oldProperty.name ?? '',
    inputType: 'range' as const,
    id: oldProperty.id ?? newId(),
    shape: {
      isNumber: oldProperty?.shape.isNumber ?? true,
      label: oldProperty.shape.label ?? '',
    },
  };

  const property: SubTypeProperty = { ...base };

  if (!base.shape.isNumber) {
    property.shape.options = [];
  } else {
    property.shape.min = oldProperty.min ?? 0;
    property.shape.max = oldProperty.max ?? 100;
    property.shape.step = oldProperty.step ?? 1;
  }

  return property;
}
