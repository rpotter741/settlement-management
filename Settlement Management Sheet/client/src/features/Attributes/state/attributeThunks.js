import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';
import {
  addAttribute,
  deleteAttribute,
} from 'features/Attributes/state/attributeSlice.js';
import { selectKey } from 'features/selection/selectionSlice.js';

export const loadSelectedAttribute =
  ({ refId, id }) =>
  async (dispatch, getState) => {
    const state = getState();
    const oldId = state.selection.attribute;

    await queryClient.prefetchQuery({
      queryKey: ['attributes', id],
      queryFn: async () => {
        const { data } = await api.get(`/attributes/${id}`);
        return data;
      },
    });

    const cachedAttribute = queryClient.getQueryData(['attributes', id]);

    if (!state.attributes.byId[refId]) {
      dispatch(addAttribute({ attribute: cachedAttribute }));
    }

    dispatch(selectKey({ key: 'attribute', value: refId }));

    if (oldId) dispatch(deleteAttribute({ refId: oldId })); // prevent removing null
  };
