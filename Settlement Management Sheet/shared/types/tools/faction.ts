import { BaseEntry, GlossaryEntryType, UUID } from '../index';

export interface FactionEntry extends BaseEntry {
  leader?: string;
  homeBase?: string;
  disposition: Record<UUID, number>;
  allies?: UUID[];
  enemies?: UUID[];
  influence?: number;
  notoriety?: number;
  cultureTags: string[];
  activeKeys: UUID[];
  passiveBonuses?: Record<string, number>;
}
