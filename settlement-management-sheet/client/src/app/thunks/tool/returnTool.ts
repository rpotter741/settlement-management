import queryClient from 'context/QueryClient.js';
import api from '@/services/interceptor.js';
import { ToolName, Tool } from 'types/index.js';
import toolServices from '@/services/toolServices.js';

interface ReturnToolParams {
  tool: ToolName;
  refId: string;
  id: string;
}

export default function returnTool({
  tool,
  refId,
  id,
}: ReturnToolParams): Promise<Tool | undefined> {
  // Prefetch the tool data
  return queryClient
    .prefetchQuery({
      queryKey: [tool, id],
      queryFn: async () => {
        const data = await toolServices.getItem({
          tool,
          refId,
          id,
        });
        return data as Tool;
      },
    })
    .then(() => {
      // Return the cached item
      return queryClient.getQueryData<Tool>([tool, id]);
    });
}
