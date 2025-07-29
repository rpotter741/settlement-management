import api from '@/services/interceptor.js';
import { ToolName, Tool, GenericObject } from 'types/index.js';
import { useInfiniteQuery } from '@tanstack/react-query';

export default async function paginateToolContent({
  tool,
  scope,
  search = '',
  dependency = false,
  depId = null,
}: {
  tool: ToolName;
  scope: string;
  search?: string;
  dependency?: boolean;
  depId?: string | null;
}): Promise<{
  data: any;
  hasNextPage: boolean;
}> {
  return useInfiniteQuery({
    queryKey: ['paginatedTool', { tool, scope, search, dependency, depId }],
    queryFn: ({ pageParam = 0 }) =>
      api
        .get('/tools/content', {
          params: {
            limit: 10,
            offset: pageParam,
            search,
            tool,
            scope,
            dependency,
            depId,
          },
        })
        .then((res) => {
          console.log(res.data);
          return {
            data: res.data,
            hasNextPage: res.data.items.length === 10,
          };
        }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) =>
      lastPage?.items?.length === 10 ? lastPage.nextOffset : undefined,
  });
}
