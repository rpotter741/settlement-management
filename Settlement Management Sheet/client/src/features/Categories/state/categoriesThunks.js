import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';
import {
  addCategory,
  deleteById,
} from 'features/Categories/state/categoriesSlice.js';
import { selectKey } from 'features/selection/selectionSlice.js';

export const loadSelectedCategory =
  ({ refId, id }) =>
  async (dispatch, getState) => {
    const state = getState();
    const oldId = state.selection.category;

    await queryClient.prefetchQuery({
      queryKey: ['categories', id],
      queryFn: async () => {
        const { data } = await api.get(`/categories/${id}`);
        return data;
      },
    });

    const cachedCategory = queryClient.getQueryData(['categories', id]);

    if (!state.categories.byId[refId]) {
      dispatch(addCategory({ category: cachedCategory }));
    }

    dispatch(selectKey({ key: 'category', value: refId }));

    if (oldId) dispatch(deleteById({ refId: oldId })); // prevent removing null
  };
