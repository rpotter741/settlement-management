import { dispatch } from '@/app/constants.js';
import {
  GenericObject,
  GlossaryEntryType,
} from '../../../../../shared/types/index.js';
import {
  changeSubTypeProperty,
  changeSubTypeSubProperty,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import { SubTypePropertyTypes } from '@/features/Glossary/EditGlossary/Templates/generics/genericContinent.js';
import { v4 as newId } from 'uuid';
import { addDirtyKeypath } from '@/app/slice/dirtySlice.js';

export function changeSubTypePropertyDispatch({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  property,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  property: any;
}) {
  dispatch(
    changeSubTypeProperty({
      subTypeId,
      groupId,
      propertyId,
      property,
    })
  );
}

export function createDefaultProperty(
  type: SubTypePropertyTypes,
  name: string
): SubTypeProperty | null {
  let property: Partial<SubTypeProperty> = { name };
  switch (type) {
    case 'text':
      property.id = newId();
      property.type = 'text';
      property.inputType = 'text';
      property.defaultValue = '';
      property.textTransform = 'none';
      property.columns = 2;
      break;
    case 'date':
      property.id = newId();
      property.type = 'date';
      property.columns = 2;
      break;
    case 'dropdown':
      property.id = newId();
      property.type = 'dropdown';
      property.selectType = 'single';
      property.optionType = 'list';
      property.options = [];
      property.isCompound = false;
      property.columns = 2;
      break;
    case 'checkbox':
      property.id = newId();
      property.type = 'checkbox';
      property.defaultChecked = false;
      property.columns = 2;
      break;
    case 'range':
      property.id = newId();
      property.type = 'range';
      property.isNumber = true;
      property.min = 0;
      property.max = 100;
      property.step = 1;
      property.label = '';
      property.columns = 2;
      break;
    case 'compound':
      property.type = 'compound';
      property.left = {
        id: newId(),
        name: 'New Select',
        type: 'dropdown',
        selectType: 'single',
        optionType: 'entryType',
        relationship: '',
      };
      property.right = {
        id: newId(),
        name: 'New Text',
        type: 'text',
        inputType: 'text',
        defaultValue: '',
      };
      property.columns = 4;
      break;
    default:
      return null;
  }

  return property as SubTypeProperty;
}

export function createAndDispatchDefaultProperty({
  subTypeId,
  groupId,
  propertyId,
  propertyType,
  name,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  propertyType: SubTypePropertyTypes;
  name: string;
}) {
  const property = createDefaultProperty(propertyType, name);
  if (!property) return;

  dispatch(
    addDirtyKeypath({
      scope: 'subType',
      id: subTypeId,
      keypath: `${subTypeId}.groupData.${groupId}.propertyData.${propertyId}`,
    })
  );

  dispatch(
    changeSubTypeProperty({
      subTypeId,
      groupId,
      propertyId,
      property,
    })
  );
}

export function createAndDispatchDefaultSubProperty({
  subTypeId,
  groupId,
  propertyId,
  side,
  propertyType,
  name,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  side: 'left' | 'right';
  propertyType: SubTypePropertyTypes;
  name: string;
}) {
  const subProperty = createDefaultProperty(propertyType, name);
  console.log(subProperty);
  if (!subProperty) return;

  dispatch(
    addDirtyKeypath({
      scope: 'subType',
      id: subTypeId,
      keypath: `${subTypeId}.groupData.${groupId}.propertyData.${propertyId}.${side}`,
    })
  );

  dispatch(
    changeSubTypeSubProperty({
      subTypeId,
      groupId,
      propertyId,
      side,
      subProperty,
    })
  );
}

export function transformTextInputType(oldProperty: any): GenericObject | null {
  if (!oldProperty) return null;
  const { inputType } = oldProperty;
  const base = {
    name: oldProperty.name ?? '',
    type: 'text' as const,
    inputType: oldProperty.inputType ?? 'text',
    columns: inputType === 'richtext' ? 4 : 2,
    id: oldProperty.id ?? newId(),
  };
  if (oldProperty.inputType === 'number') {
    return { ...base, defaultValue: 0, minValue: 0, maxValue: 100 };
  }
  return { ...base, defaultValue: '', textTransform: 'none' };
}

export function transformDropDownInputType(
  oldProperty: any
): GenericObject | null {
  if (!oldProperty) return null;

  const base = {
    name: oldProperty.name ?? '',
    type: 'dropdown' as const,
    id: oldProperty.id ?? newId(),
    selectType: oldProperty.selectType ?? 'single',
    optionType: oldProperty.optionType ?? 'list',
    isCompound: oldProperty.isCompound ?? false,
    columns: oldProperty.columns ?? 2,
  };

  const property: GenericObject = { ...base };

  // Add-on modifiers
  if (base.selectType === 'multi') {
    property.maxSelections = oldProperty.maxSelections ?? 3;
  }

  if (base.optionType === 'entryType') {
    property.relationship = oldProperty.relationship ?? '';
  } else if (base.optionType === 'list') {
    property.options = oldProperty.options ?? [];
  }
  return property;
}

export function transformRangeInputType(
  oldProperty: any
): GenericObject | null {
  if (!oldProperty) return null;
  const base = {
    name: oldProperty.name ?? '',
    type: 'range' as const,
    isNumber: oldProperty?.isNumber ?? true,
    label: oldProperty.label ?? '',
    columns: oldProperty.columns ?? 2,
    id: oldProperty.id ?? newId(),
  };

  const property: GenericObject = { ...base };

  if (!base.isNumber) {
    property.options = [];
  } else {
    property.min = oldProperty.min ?? 0;
    property.max = oldProperty.max ?? 100;
    property.step = oldProperty.step ?? 1;
  }

  return property;
}
