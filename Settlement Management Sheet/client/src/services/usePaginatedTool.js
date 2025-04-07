import { useInfiniteQuery } from '@tanstack/react-query';
import api from 'services/interceptor.js';

const usePaginatedTool = ({ tool, type, search = '' }) =>
  useInfiniteQuery({
    queryKey: [tool, type, search],
    queryFn: ({ pageParam = 0 }) =>
      api
        .get(`/${tool}/${type}`, {
          params: { limit: 10, offset: pageParam, search },
        })
        .then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === 10 ? lastPage.nextOffset : undefined,
  });

export default usePaginatedTool;
