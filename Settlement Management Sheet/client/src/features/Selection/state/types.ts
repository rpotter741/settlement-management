export interface SelectionObject {
  id: string;
  children: SelectionObject[];
  [key: string]: any;
}

export type SelectionState = {
  selectedIds: string[];
  lastSelectedId: string | null;
  isFocused: boolean;
};
