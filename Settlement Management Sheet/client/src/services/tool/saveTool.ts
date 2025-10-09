import api from '@/services/interceptor.js';
import { ToolName, GenericObject } from 'types/index.js';

export default async function saveTool({
  tool,
  data,
  id,
}: {
  tool: ToolName;
  data: GenericObject;
  id: string;
}): Promise<void> {
  try {
    await api.post(`/tools/save`, {
      id,
      data: {
        ...data,
        contentType: 'OFFICIAL',
        createdBy: 'robbiepottsdm',
      },
      tool,
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
  }
}
