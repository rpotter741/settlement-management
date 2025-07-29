import api from '@/services/interceptor.js';
import { ToolName, Tool, GenericObject } from 'types/index.js';

export default async function getContent(
  tool: ToolName
): Promise<Tool[] | GenericObject> {
  try {
    const res: any = await api.get('/tools/getContent', { params: { tool } });
    console.log(res.data);
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
