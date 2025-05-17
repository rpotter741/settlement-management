import api from 'services/interceptor.ts';
import queryClient from 'context/QueryClient.js';

const getNewDependencies = async ({ edit, selected, tool }) => {
  const dependencies = { ...edit.dependencies.data };
  const existing = { ...edit.dependencies.data };
  console.log('selected', selected);
  await api
    .post('/tools/fetchByIds', {
      tool,
      ids: selected.ids,
    })
    .then(({ data }) => {
      data.forEach((item) => {
        queryClient.setQueryData([tool, item.refId, item.id], item);
      });
    });

  selected.ids.forEach((id, n) => {
    const object = queryClient.getQueryData([tool, selected.refIds[n], id]);
    const item = (dependencies[id] = {
      ...edit.dependencies.data[id],
      name: object.name,
      thresholds: object.thresholds.order.map((thresh) => {
        return {
          name: object.thresholds.data[thresh].name,
          modifier: edit.dependencies.data[id]?.modifier || 1,
        };
      }),
    });
    existing[id] = item;
  });
  console.log('existing', existing);
  return existing;
};

export default getNewDependencies;
