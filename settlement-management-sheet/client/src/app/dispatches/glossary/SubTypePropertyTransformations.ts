import { SubTypeRangeDefinition } from '@/features/Glossary/EditGlossary/Templates/components/types.ts';
import { GenericObject } from '../../../../../shared/types/common.ts';
import {
  AllShapes,
  SubTypeDropdownProperty,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { SubTypePropertyTypes } from '@/features/Glossary/EditGlossary/Templates/generics/genericContinent.js';
import isAdmin from '@/utility/isAdmin.js';
import { v4 as newId } from 'uuid';

export function createDefaultProperty(
  type: SubTypePropertyTypes,
  name: string,
  propertyId: string
): SubTypeProperty | null {
  switch (type) {
    case 'text':
      return {
        id: propertyId,
        name,
        inputType: 'text',
        shape: {
          inputType: 'text',
          defaultValue: '',
          textTransform: 'none',
        },
        version: 1,
        isAnchor: false,
        contentType: isAdmin([]) ? 'SYSTEM' : 'CUSTOM',
      };

    case 'date':
      return {
        id: propertyId,
        name,
        inputType: 'date',
        shape: {},
        version: 1,
        isAnchor: false,
        contentType: isAdmin([]) ? 'SYSTEM' : 'CUSTOM',
      };

    case 'dropdown':
      return {
        id: propertyId,
        name,
        inputType: 'dropdown',
        shape: {
          selectType: 'single',
          optionType: 'list',
          defaultList: [],
          options: [],
          isCompound: false,
        },
        version: 1,
        contentType: isAdmin([]) ? 'SYSTEM' : 'CUSTOM',
        smartSync: null,
      };

    case 'checkbox':
      return {
        id: propertyId,
        name,
        inputType: 'checkbox',
        shape: {
          defaultChecked: false,
        },
        version: 1,
        isAnchor: false,
        contentType: isAdmin([]) ? 'SYSTEM' : 'CUSTOM',
      };

    case 'range':
      return {
        id: propertyId,
        name,
        inputType: 'range',
        shape: {
          isNumber: true,
          min: 0,
          max: 0,
          step: 1,
          label: '',
        },
        version: 1,
        isAnchor: false,
        contentType: isAdmin([]) ? 'SYSTEM' : 'CUSTOM',
      };

    case 'compound':
      return {
        id: propertyId,
        name,
        inputType: 'compound',
        shape: {
          //@ts-ignore
          left: {
            id: newId(),
            name: 'New Select',
            inputType: 'dropdown',
            shape: {
              selectType: 'single',
              optionType: 'entryType',
              relationship: [],
              defaultList: undefined,
              maxSelections: undefined,
              options: undefined,
              isCompound: false,
            },
          },
          //@ts-ignore
          right: {
            id: newId(),
            name: 'New Text',
            inputType: 'text',
            shape: {
              inputType: 'text',
              defaultValue: '',
              textTransform: 'none',
            },
          },
          isProjection: false,
        },
        version: 1,
        isAnchor: false,
        contentType: isAdmin([]) ? 'SYSTEM' : 'CUSTOM',
      };

    default:
      return null;
  }
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

  const base = {
    name: oldProperty.name ?? '',
    inputType: 'dropdown' as const,
    id: oldProperty.id ?? newId(),
    shape: {
      selectType: oldProperty.shape.selectType ?? 'single',
      optionType: oldProperty.shape.optionType ?? 'list',
      isCompound: oldProperty.shape.isCompound ?? false,
    },
    contentType: 'CUSTOM' as const,
    smartSync: oldProperty?.smartSync ?? null,
  };

  const property: SubTypeDropdownProperty = { ...base };

  // Add-on modifiers
  if (base.shape.selectType === 'multi') {
    property.shape.maxSelections = oldProperty.shape.maxSelections ?? 3;
  }

  if (base.shape.optionType === 'entryType') {
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
    contentType: 'CUSTOM' as const,
  };

  //@ts-ignore
  const property: SubTypeRangeDefinition = { ...base };

  if (!base.shape.isNumber) {
    //@ts-ignore
    property.shape.options = [];
  } else {
    //@ts-ignore
    property.shape.min = oldProperty.min ?? 0;
    //@ts-ignore
    property.shape.max = oldProperty.max ?? 100;
    //@ts-ignore
    property.shape.step = oldProperty.step ?? 1;
  }

  //@ts-ignore
  return property;
}
