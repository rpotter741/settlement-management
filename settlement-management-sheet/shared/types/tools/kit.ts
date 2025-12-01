import { ToolName, GlossaryEntryType, BaseTool, UUID } from '../index';

export interface KitEntry {
  id: UUID;
  refID: UUID;
  name: string;
}

export interface KitTool extends BaseTool {
  data: Partial<Record<ToolName | GlossaryEntryType, KitEntry[]>>;
}
