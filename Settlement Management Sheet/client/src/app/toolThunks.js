import queryClient from 'context/QueryClient.js';
import api from 'services/interceptor.js';
import { addTool } from './toolSlice.js';
import { addTab } from 'features/sidePanel/sidePanelSlice.js';
import { v4 as newId } from 'uuid';

export const loadTool =
  ({ tool, refId, id, currentTool }) =>
  async (dispatch, getState) => {
    const state = getState();
    const usedTool = currentTool || tool;
    console.log('usedTool', tool, refId, id, currentTool);
    await queryClient.prefetchQuery({
      queryKey: [usedTool, id],
      queryFn: async () => {
        const { data } = await api.get('/tools/getItem', {
          params: {
            tool: usedTool,
            refId,
            id,
          },
        });
        console.log(data, 'dataaaaa');
        return data;
      },
    });

    const cachedItem = queryClient.getQueryData([usedTool, id]);
    console.log('cachedItem', cachedItem);

    if (!state.tools[usedTool].static.byId[id]) {
      dispatch(addTool({ tool: usedTool, data: cachedItem }));
    }
    dispatch(
      addTab({
        name: cachedItem.name,
        id: cachedItem.id,
        mode: 'edit',
        type: usedTool,
        tabId: newId(),
        scroll: 0,
        activate: true,
        side: 'right',
      })
    );
  };
