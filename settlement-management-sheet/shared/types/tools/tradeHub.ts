import { BaseTool, UUID } from '../index';

export interface TradeGood {
  name: string;
  description: string;
  attribute: UUID[];
  stock: number;
}

export interface TradeHubTool extends BaseTool {
  stock: TradeGood[];
  region: string;
  location: string | null;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendRange: [number, number];
  collective?: UUID;
}
