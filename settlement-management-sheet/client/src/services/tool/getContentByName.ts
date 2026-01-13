import api from '@/services/interceptor.js';
import { ToolName, Tool, GenericObject } from 'types/index.js';

export default async function getContentByName(
  tool: ToolName,
  name: string
): Promise<Tool[] | GenericObject> {
  try {
    const res: any = await api.get('/tools/contentByName', {
      params: { tool, name },
    });
    return res.data as Tool[];
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to fetch ${tool} content by name`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
}
