export interface SubTypeCheckboxDefinition {
  name: string;
  defaultChecked: boolean;
}

export interface SubTypeCheckboxData {
  id: string;
  name: string;
  value: boolean;
}

export interface SubTypeTextDefinition {
  name: string;
  inputType: 'text' | 'richtext' | 'number';
  valueLabel?: string;
  defaultValue?: string;
  minValue?: number;
  maxValue?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface SubTypeTextData {
  id: string;
  name: string;
  value: string | number;
}

export interface SubTypeRangeDefinition {
  name: string;
  isNumber: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface SubTypeRangeData {
  id: string;
  name: string;
  value: number;
}

export interface SubTypeDropdownDefinition {
  name: string;
  selectType: 'single' | 'multi';
  optionType: 'list' | 'entryType';
  options?: string[];
  relationship?: string;
  maxSelections?: number;
}

export interface SubTypeDropdownData {
  id: string;
  name: string;
  value: string | string[];
}

export interface SubTypeCompoundDataTypes {
  left:
    | SubTypeTextData
    | SubTypeCheckboxData
    | SubTypeRangeData
    | SubTypeDropdownData;
  right:
    | SubTypeTextData
    | SubTypeCheckboxData
    | SubTypeRangeData
    | SubTypeDropdownData;
}

export interface SubTypeCompoundDefinition {
  name: string;
  left:
    | SubTypeTextDefinition
    | SubTypeCheckboxDefinition
    | SubTypeRangeDefinition;
  right:
    | SubTypeTextDefinition
    | SubTypeCheckboxDefinition
    | SubTypeRangeDefinition;
}

export interface SubTypeCompoundData {
  id: string;
  name: string;
  order: string[];
  value: Record<string, SubTypeCompoundDataTypes>;
}
