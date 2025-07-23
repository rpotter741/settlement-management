import { GlossaryEntryType } from 'types/index.js';
import { ToolName } from './ToolTypes.js';

export type TabType = 'tool' | 'glossary' | 'other';

export type TabTools = ToolName | GlossaryEntryType | 'editGlossary';

export interface Tab {
  name: string; // the name of the tab, synced to the name of the tool or glossary entry
  mode: 'edit' | 'preview';
  side: 'left' | 'right'; // the side of the panel this tab is on
  tool: TabTools; // the tool or glossary entry type associated with this tab
  id: string; // unique identifier for the tool or glossary entry
  tabId: string; // unique identifier for the tab
  preventSplit: boolean; // whether this tab should prevent splitting
  tabType: TabType; // the type of tab, e.g., 'glossary', 'tool', 'editGlossary'
  disableMenu?: boolean; // whether to disable the file menu for this tab
  glossaryId?: string; // the Id of the glossary this tab may belong to
  viewState: {
    isDirty: boolean;
    scroll: number;
    lastUpdated?: Record<string, number>; // timestamps for when the tab was last updated
    lastFocusedElement?: string; // the last focused element in the tab
    [key: string]: any; // additional properties can be added as needed
  }; // state specific to this tab, such as last updated time or active index
}

export interface TabState {
  leftTabs: Tab[];
  rightTabs: Tab[];
  sidePanelOpen: boolean;
  splitTabs: boolean;
  preventSplit: boolean;
  currentLeftTab: string | null;
  currentRightTab: string | null;
  currentLeftTabIndex: number | null;
  currentRightTabIndex: number | null;
  focusedTab: Tab | null;
  breadcrumbs: string[];
  toolOptions: Record<ToolName, string[]> | {};
}

export interface AddTabPayload {
  name: string;
  mode: 'edit' | 'preview';
  tool: TabTools;
  id: string;
  tabId: string;
  scroll: number;
  activate?: boolean;
  side?: 'left' | 'right';
  preventSplit: boolean | undefined;
  tabType?: TabType;
  disableMenu?: boolean;
  glossaryId?: string;
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
  tabId: string;
  keypath: string;
  side: 'left' | 'right';
  updates: any;
}

export interface MoveTabPayload {
  tabId: string;
  dropIndex: number;
}

export interface SetTabDirtyPayload {
  id: string;
  isDirty: boolean;
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
