import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';
import { selectKey } from 'features/selection/selectionSlice.js';
import { addTool, deleteById, setCurrent } from './toolSlice.js';

export const loadTool =
  ({ tool, refId, id, setNew = false }) =>
  async (dispatch, getState) => {
    const state = getState();
    const oldId = state.tools[tool].current.refId;

    await queryClient.prefetchQuery({
      queryKey: [tool, refId],
      queryFn: async () => {
        const { data } = await api.get('/tools/getItem', {
          params: {
            tool,
            refId,
            id,
          },
        });
        return data;
      },
    });

    const cachedItem = queryClient.getQueryData([tool, refId]);

    if (!state.tools[tool].byId[refId]) {
      dispatch(addTool({ tool, data: cachedItem }));
      if (setNew) {
        dispatch(setCurrent({ tool, data: cachedItem, initializeEdit: true }));
      }
    }

    dispatch(selectKey({ key: tool, value: refId }));

    if (oldId) dispatch(deleteById({ tool, refId: oldId })); // prevent removing null
  };
