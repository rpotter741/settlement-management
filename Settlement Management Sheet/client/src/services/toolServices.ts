import queryClient from '@/context/QueryClient.js';
import api from './interceptor.js';
import { ToolName, Tool } from '../../../types/index.js';
import { ToolData } from '@/app/types/ToolTypes.js';
import Dependency from '@/components/shared/Metadata/Dependency.js';
import { useInfiniteQuery } from '@tanstack/react-query';

const getContent = async (tool: ToolName) => {
  try {
    const res: any = await api.get('/tools/getContent', { params: { tool } });
    return res.data as Tool[];
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to fetch ${tool} content`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

const getContentByName = async (tool: ToolName, name: string) => {
  try {
    const res: any = await api.get('/tools/contentByName', {
      params: { tool, name },
    });
    return res.data as Tool[];
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to fetch ${tool} content by name`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

const getItem = async (tool: ToolName, refId: string, id: string) => {
  try {
    const res: any = await api.get('/tools/getItem', {
      params: { tool, refId, id },
    });
    return res.data as Tool;
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to fetch ${tool} data`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

const fetchByIds = async (tool: ToolName, ids: string[]) => {
  try {
    const res: any = await api.post('/tools/fetchByIds', {
      tool,
      ids,
    });
    return res.data as Tool[];
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to fetch ${tool} data by IDs`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

const saveTool = async ({ tool, data }: { tool: ToolName; data: ToolData }) => {
  try {
    await api.post(`/tools/${tool}/save`, {
      data: {
        ...data,
        contentType: 'OFFICIAL',
        createdBy: 'robbiepottsdm',
      },
      tool,
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to save ${tool} data`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

const deleteTool = async ({ tool, id }: { tool: ToolName; id: string }) => {
  try {
    await api.post(`/tools/${tool}/delete`, { tool, id });
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to delete ${tool} data`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

const publishTool = async ({
  tool,
  refId,
  id,
}: {
  tool: ToolName;
  refId: string;
  id: string;
}) => {
  try {
    await api.post(`/tools/${tool}/publish`, {
      data: { refId, id },
      tool,
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
    const snackbar = {
      message: error.message || `Failed to publish ${tool} data`,
      type: 'error',
      duration: 5000,
    };
    return snackbar;
  }
};

///rewrite for checking cache first
const prefetchToolContent = (
  tool: ToolName,
  scopes = ['personal', 'community']
) => {
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
      })(scope),
      initialPageParam: 0,
      getNextPageParam: (lastPage: any) =>
        lastPage?.items?.length === 10 ? lastPage.nextOffset : undefined,
    });
  });
};

const paginateToolContent = ({
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
}) => {
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
        .then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) =>
      lastPage?.items?.length === 10 ? lastPage.nextOffset : undefined,
  });
};

const actions = {
  getContent,
  getContentByName,
  getItem,
  fetchByIds,
  saveTool,
  deleteTool,
  publishTool,
  prefetchToolContent,
  paginateToolContent,
};

export default actions;
