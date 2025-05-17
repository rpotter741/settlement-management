import { useInfiniteQuery } from '@tanstack/react-query';
import api from 'services/interceptor.ts';

const usePaginatedTool = ({
  tool,
  scope,
  search = '',
  dependency = false,
  depId = null,
}) =>
  useInfiniteQuery({
    queryKey: ['paginatedTool', { tool, scope, search, dependency, depId }],
    queryFn: ({ pageParam = 0 }) =>
      api
        .get(`/tools/content`, {
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
        .then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === 10 ? lastPage.nextOffset : undefined,
  });

export default usePaginatedTool;
