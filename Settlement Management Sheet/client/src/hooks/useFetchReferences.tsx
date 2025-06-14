import { useEffect, useState } from 'react';
import queryClient from '@/context/QueryClient.js';
import api from '@/services/interceptor.js';
import { ToolData, ToolName } from '@/app/types/ToolTypes.js';

const useFetchReferences = (
  tool: ToolName,
  refIds: string[] = []
): ToolData[] => {
  const [resolved, setResolved] = useState<ToolData[]>([]);

  useEffect(() => {
    const cached = refIds.map((id) => queryClient.getQueryData([tool, id]));

    const missing = refIds.filter((_, idx) => cached[idx] === undefined);

    if (missing.length > 0) {
      api
        .post('/tools/fetchByIds', {
          tool,
          ids: missing,
        })
        .then(({ data }) => {
          data.forEach((item: ToolData) => {
            queryClient.setQueryData([tool, item.id], item);
          });
          setResolved(
            refIds
              .map((id) => queryClient.getQueryData<ToolData>([tool, id]))
              .filter((item): item is ToolData => item !== undefined)
          );
        });
    } else {
      setResolved(
        cached.filter((item): item is ToolData => item !== undefined)
      );
    }
  }, [tool, refIds]);
  return resolved;
};

export default useFetchReferences;
