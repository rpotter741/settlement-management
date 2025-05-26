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
  renderState: Record<
    string,
    {
      expanded: boolean;
      rename: boolean;
    }
  >;
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
