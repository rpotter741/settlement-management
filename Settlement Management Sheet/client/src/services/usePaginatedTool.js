import { useInfiniteQuery } from '@tanstack/react-query';
import api from 'services/interceptor.js';

const usePaginatedTool = ({ tool, scope, search = '' }) =>
  useInfiniteQuery({
    queryKey: [tool, scope, search],
    queryFn: ({ pageParam = 0 }) =>
      api
        .get(`/tools/content`, {
          params: { limit: 10, offset: pageParam, search, tool, scope },
        })
        .then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === 10 ? lastPage.nextOffset : undefined,
  });

export default usePaginatedTool;
