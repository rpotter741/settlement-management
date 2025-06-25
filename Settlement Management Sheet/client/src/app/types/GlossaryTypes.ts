import {
  GlossaryEntry,
  GlossaryEntryType,
  GlossaryNode,
} from '../../../../types/index.js';

export type GlossaryEntryArrayKeys = 'regions' | 'climate' | 'type';

export interface GlossaryStateEntry {
  name: string;
  description: string;
  id: string;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  nodes: Record<string, GlossaryNode>;
  structure: GlossaryNode[];
  renderState: Record<
    string,
    {
      expanded: boolean;
      rename: boolean;
    }
  >;
  entries: Record<string, GlossaryEntry>;
  options: Record<string, Partial<GlossaryEntry>>;
}

export interface GlossaryState {
  glossaries: Record<string, GlossaryStateEntry>;
  activeGlossaryId: string | null;
  snackbar: {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    duration: number;
    rollback?: any;
    rollbackFn?: (rollback: any) => void;
  } | null;
}

export interface GlossaryDirectoryProps {
  structure: GlossaryNode[] | [];
  nodeMap: Record<string, GlossaryNode>;
  onRename: (node: GlossaryNode) => void;
  onDelete: ({
    id,
    entryType,
    glossaryId,
  }: {
    id: string;
    entryType: GlossaryEntryType;
    glossaryId: string | null;
  }) => void;
  onNewFile: ({
    id,
    parentId,
    entryType,
  }: {
    id: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => void;
  onNewFolder: ({
    id,
    name,
    parentId,
    entryType,
  }: {
    id: string;
    name: string;
    parentId: string | null;
    entryType: GlossaryEntryType;
  }) => void;
  handleCreateGlossary: () => void;
}
