import api from '@/services/interceptor.js';
import { ToolName } from 'types/index.js';

export default async function deleteTool({
  tool,
  id,
}: {
  tool: ToolName;
  id: string;
}) {
  try {
    await api.post(`/tools/delete`, { tool, id });
  } catch (error: any) {
    console.error('API Error:', error.message);
  }
}
