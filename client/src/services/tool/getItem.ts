import api from '@/services/interceptor.js';
import { ToolName, Tool, GenericObject } from 'types/index.js';

export default async function getItem({
  tool,
  refId,
  id,
}: {
  tool: ToolName;
  refId: string;
  id: string;
}): Promise<Tool | undefined> {
  try {
    const res: any = await api.get('/tools/getItem', {
      params: { tool, refId, id },
    });
    return res.data as Tool;
  } catch (error: any) {
    console.error('API Error:', error.message);
  }
}
