import api from '@/services/interceptor.js';
import { ToolName, Tool, GenericObject } from 'types/index.js';

export default async function getContent({
  tool,
  scope,
  search = '',
  dependency = false,
  depId = null,
  offset = 0,
}: {
  tool: ToolName;
  scope: string;
  search?: string;
  dependency?: boolean;
  depId?: string | null;
  offset?: number;
}): Promise<Tool[] | GenericObject> {
  try {
    const res: any = await api.get('/tools/content', {
      params: { tool, scope, search, dependency, depId, offset },
    });
    return res.data as Tool[];
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to fetch ${tool} content`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
}
