import { GlossaryEntryType } from 'types/glossaryEntry.js';
import { TabTools, TabType } from './SidePanelTypes.js';

// types.ts
export interface ToolData {
  id: string;
  refId: string;
  name?: string;
  description?: string;
  version: number;
  createdBy: string;
  contentType: 'OFFICIAL' | 'CUSTOM';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ToolState {
  static: {
    byId: Record<string, ToolData>;
    allIds: string[];
  };
  edit: {
    byId: Record<string, ToolData>;
    allIds: string[];
  };
}

export type ToolName =
  | 'apt'
  | 'action'
  | 'attribute'
  | 'building'
  | 'category'
  | 'event'
  | 'kit'
  | 'listener'
  | 'settlementType'
  | 'settlement'
  | 'gameStatus'
  | 'storyThread'
  | 'tradeHub'
  | 'upgrade';

export interface ToolsState {
  [key: string]: ToolState;
}

export interface InitializeToolPayload {
  tool: ToolName;
  data: ToolData;
}

export interface AddToolPayload {
  tool: ToolName;
  data: ToolData;
}

export interface InitializeEditPayload {
  tool: ToolName;
  id: string;
}

export interface SaveToolPayload {
  tool: ToolName;
  id: string;
  overwriteCurrent?: boolean;
}

export interface UpdateByIdPayload {
  tool: ToolName;
  id: string;
  keypath: string;
  updates: any;
}

export interface DeleteByIdPayload {
  tool: ToolName;
  id: string;
}

export interface TabDataPayload {
  name: string;
  id: string;
  mode: 'preview' | 'edit';
  tool: TabTools;
  tabId: string;
  scroll: number;
  activate: boolean;
  side: 'left' | 'right';
  preventSplit: boolean;
  tabType?: TabType;
  disableMenu?: boolean;
  glossaryId?: string;
}
