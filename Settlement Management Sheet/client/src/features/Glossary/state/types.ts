import { GlossaryNode } from '../../../../../types';

export interface GlossaryStateEntry {
  name: string;
  description: string;
  id: string;
  hydrated: boolean;
  loading: boolean;
  error: string | null;
  nodes: Record<string, GlossaryNode>;
  structure: GlossaryNode[];
  expanded: Record<string, boolean>;
}

export interface GlossaryState {
  glossaries: Record<string, GlossaryStateEntry>;
  activeGlossaryId: string | null;
}
