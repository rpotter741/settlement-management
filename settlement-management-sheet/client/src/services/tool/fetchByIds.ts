import api from '@/services/interceptor.js';
import { ToolName, Tool, GenericObject } from 'types/index.js';

export default async function fetchByIds({
  tool,
  ids,
}: {
  tool: ToolName;
  ids: string[];
}): Promise<Tool[] | undefined> {
  try {
    const res: any = await api.post('/tools/fetchByIds', {
      tool,
      ids,
    });
    return res.data as Tool[];
  } catch (error: any) {
    console.error('API Error:', error.message);
  }
}
