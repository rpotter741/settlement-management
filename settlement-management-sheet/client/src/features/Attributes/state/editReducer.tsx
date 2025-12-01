import { keys } from 'lodash';

export type AttrPropertyTypes =
  | 'Properties'
  | 'Values'
  | 'SPC'
  | 'Thresholds'
  | 'Currency'
  | 'Gather'
  | 'Upkeep';

export type AttrAction =
  | { type: 'TOGGLE_PROPERTIES' }
  | {
      type: 'SET_ACTIVE_TAB';
      payload: {
        name: AttrPropertyTypes;
        index: number;
        defaultLast?: boolean;
      };
    }
  | {
      type: 'SET_TAB_DISABLED';
      payload: { property: AttrPropertyTypes; disabled: boolean };
    };

interface AttrPropertiesState {
  name: string; // The name of the tab
  disabled: boolean; // Whether the tab is disabled
}

export interface EditAttrStateInterface {
  propertiesExpanded: boolean; // Whether the properties section is expanded
  editTabs: Record<AttrPropertyTypes, AttrPropertiesState>; // The tabs for editing attributes
  activeTab: AttrPropertyTypes; // The currently active tab
  lastTab: AttrPropertyTypes | null; // The last active tab before the current one
  activeIndex: number; // The index of the currently active tab
  lastIndex: number; // The last index of the active tab
}

export const editAttrState: EditAttrStateInterface = {
  propertiesExpanded: true,
  editTabs: {
    Properties: { name: 'Properties', disabled: false },
    Values: { name: 'Values', disabled: false },
    SPC: { name: 'SPC', disabled: false },
    Thresholds: { name: 'Thresholds', disabled: false },
    Currency: { name: 'Currency', disabled: true },
    Gather: { name: 'Gather', disabled: true },
    Upkeep: { name: 'Upkeep', disabled: true },
  },
  activeTab: 'Properties', // Default active tab
  lastTab: null,
  activeIndex: 0, // Default active index
  lastIndex: 0, // Default last index
};

export function editAttrReducer(
  state: EditAttrStateInterface,
  action: AttrAction
): EditAttrStateInterface {
  switch (action.type) {
    case 'TOGGLE_PROPERTIES':
      return {
        ...state,
        propertiesExpanded: !state.propertiesExpanded,
      };
    case 'SET_ACTIVE_TAB':
      const { name, index, defaultLast } = action.payload;
      return {
        ...state,
        lastIndex: defaultLast ? 0 : state.activeIndex,
        lastTab: defaultLast ? 'Values' : state.activeTab,
        activeTab: name,
        activeIndex: index,
      };
    case 'SET_TAB_DISABLED': {
      const { property, disabled } = action.payload;
      return {
        ...state,
        editTabs: {
          ...state.editTabs,
          [property]: {
            ...state.editTabs[property],
            disabled,
          },
        },
      };
    }
    default:
      return state;
  }
}

export const toggleProperties = () =>
  ({
    type: 'TOGGLE_PROPERTIES',
  }) as const;

export const setActiveTab = (
  name: AttrPropertyTypes,
  index: number,
  defaultLast?: boolean
) =>
  ({
    type: 'SET_ACTIVE_TAB',
    payload: { name, index, defaultLast },
  }) as const;

export const setTabDisabled = (
  property: AttrPropertyTypes,
  disabled: boolean
) =>
  ({
    type: 'SET_TAB_DISABLED',
    payload: { property, disabled },
  }) as const;
