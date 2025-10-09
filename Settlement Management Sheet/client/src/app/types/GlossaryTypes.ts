import { VisibilitySetting } from '@/features/Glossary/EditGlossary/Settings/EditGlossarySettings.js';
import { GenericObject, Genre } from 'types/index.js';
import { GlossaryEntry, GlossaryEntryType, GlossaryNode } from 'types/index.js';

export type GlossaryEntryArrayKeys = 'regions' | 'climate' | 'type';

export interface GlossaryStateEntry {
  name: string;
  description: {
    markdown: string;
    string: string;
  };
  id: string;
  genre: Genre;
  subGenre: string;
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
  // options: Record<
  //   string,
  //   Partial<
  //     Record<
  //       keyof GlossaryEntry,
  //       Record<
  //         'inherited' | 'nearby' | 'extended' | 'other',
  //         Array<{ id: string; name: string; [key: string]: any }>
  //       >
  //     >
  //   >
  // >;
  options: any;
  integrationState: any;
  theme: string | { light: any; dark: any };
  templates: any;
}

export interface GlossaryState {
  glossaries: {
    edit: {
      byId: Record<string, GlossaryStateEntry>;
      allIds: string[];
    };
    static: {
      byId: Record<string, GlossaryStateEntry>;
      allIds: string[];
    };
  };
  activeGlossaryId: string | null;
  snackbar: {
    message: string;
    type: 'error' | 'success' | 'info' | 'warning';
    duration: number;
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
  onMultipleDelete: (nodes: GlossaryNode[]) => void;
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
}
