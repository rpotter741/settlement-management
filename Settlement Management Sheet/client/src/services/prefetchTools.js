import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';

const prefetchToolContent = (tool, scopes = ['personal', 'community']) => {
  scopes.forEach((scope) => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ['toolContent', tool, scope],
      queryFn: ((currentScope) => {
        return async ({ pageParam = 0 }) => {
          const { data } = await api.get('/tools/content', {
            params: {
              limit: 10,
              offset: pageParam,
              search: '',
              tool,
              scope: currentScope,
            },
          });
          return data;
        };
      })(scope), // 👈 pass scope to IIFE
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage?.items?.length === 10 ? lastPage.nextOffset : undefined,
    });
  });
};

export default prefetchToolContent;
