import queryClient from '@/context/QueryClient.js';
import api from '@/services/interceptor.js';
import { ToolName } from 'types/index.js';

///rewrite for checking cache first
export default async function prefetchToolContent(
  tool: ToolName,
  scopes = ['personal', 'community']
) {
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
          console.log(data);
          return data;
        };
      })(scope),
      initialPageParam: 0,
      getNextPageParam: (lastPage: any) =>
        lastPage?.items?.length === 10 ? lastPage.nextOffset : undefined,
    });
  });
}
