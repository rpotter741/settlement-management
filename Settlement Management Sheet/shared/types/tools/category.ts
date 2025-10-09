import { BaseTool, Thresholds, Dependencies, UUID } from '../index';

export interface Category extends BaseTool {
  thresholds: Thresholds;
  dependencies: Dependencies;
  attributes: UUID[];
}
