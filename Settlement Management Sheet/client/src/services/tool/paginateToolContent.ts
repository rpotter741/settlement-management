// usePaginatedToolContent.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import toolServices from '../toolServices.js';
import { ToolName } from 'types/index.js';

export default function usePaginatedToolContent({
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
}) {
  return useInfiniteQuery({
    queryKey: ['paginatedTool', { tool, scope, search, dependency, depId }],
    queryFn: ({ pageParam = 0 }) =>
      toolServices.getContent({
        tool,
        scope,
        search,
        dependency,
        depId,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage?.items?.length === 10 ? lastPage.nextOffset : undefined,
  });
}
