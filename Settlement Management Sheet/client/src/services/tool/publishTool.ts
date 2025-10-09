import api from '@/services/interceptor.js';
import { ToolName } from 'types/index.js';

export default async function publishTool({
  tool,
  refId,
  id,
}: {
  tool: ToolName;
  refId: string;
  id: string;
}) {
  try {
    await api.post(`/tools/${tool}/publish`, {
      data: { refId, id },
      tool,
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
  }
}
