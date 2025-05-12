import { ToolName } from '../../app/types';

export interface Tab {
  name: string;
  mode: 'edit' | 'preview';
  type: ToolName;
  id: string;
  tabId: string;
  scroll: number;
}

export interface TabState {
  leftTabs: Tab[];
  rightTabs: Tab[];
  splitTabs: boolean;
  preventSplit: boolean;
  currentLeftTab: string | null;
  currentRightTab: string | null;
  currentLeftTabIndex: number | null;
  currentRightTabIndex: number | null;
  breadcrumbs: string[];
  toolOptions: Record<ToolName, string[]> | {};
}

export interface AddTabPayload {
  name: string;
  mode: 'edit' | 'preview';
  type: ToolName;
  id: string;
  tabId: string;
  scroll: number;
  activate?: boolean;
  side?: 'left' | 'right';
}

export interface RemoveTabPayload {
  tabId: string;
  side: 'left' | 'right';
  preventSplit?: boolean;
}

export interface SetCurrentTabPayload {
  tabId: string;
  index: number;
  side?: 'left' | 'right';
}

export interface SetBreadcrumbsPayload {
  breadcrumbs: string[];
}

export interface UpdateTabPayload {
  index: number;
  side: 'left' | 'right';
  updates: Partial<Tab>;
}

export interface MoveTabPayload {
  tabId: string;
  dropIndex: number;
}

export interface OptionObject {
  id: string[];
  leads: string[];
  name: string;
  refId: string[];
}

export interface SetToolOptionsPayload {
  options: Record<string, OptionObject[]>;
}
