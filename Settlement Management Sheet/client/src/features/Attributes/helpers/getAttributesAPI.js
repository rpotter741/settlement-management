import { useInfiniteQuery } from '@tanstack/react-query';
import api from 'services/interceptor.js';

const fetchAttributes = async ({ pageParam = 0, type, search = '' }) => {
  console.log(type, 'type');
  const { data } = await api.get(`/attributes/${type}`, {
    params: { limit: 10, offset: pageParam, search },
  });

  return data;
};

const useAttributes = (type, search) => {
  return useInfiniteQuery({
    queryKey: ['attributes', type, search],
    queryFn: ({ pageParam = 0 }) =>
      fetchAttributes({ pageParam, type, search }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.items.length === 10 ? lastPage.nextOffset : undefined,
  });
};

export default useAttributes;
