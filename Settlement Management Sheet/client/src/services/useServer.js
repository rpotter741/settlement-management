import api from 'services/interceptor.js';
import queryClient from 'context/QueryClient.js';

const useServer = async ({ tool, type, data }) => {
  const { refId, id } = data;

  const actions = {
    save: () =>
      api.post(`/tools/${tool}/save`, {
        data: {
          ...data,
          contentType: 'OFFICIAL',
          createdBy: 'Admin',
        },
        tool,
      }),
    publish: () =>
      api.post(`/tools/${tool}/publish`, { data: { refId, id }, tool }),
    delete: async () => {
      try {
        await api.post(`/tools/${tool}/delete`, { refId, tool });
      } catch (error) {
        console.error('API error:', error.message);
        throw new Error(
          error.response?.data?.message || `Failed to ${type} data`
        );
      }
    },
  };

  try {
    if (!actions[type]) {
      throw new Error(`Unknown server action: ${type}`);
    }
    const response = await actions[type]();
    return response?.data;
  } catch (error) {
    console.error('API error:', error.message);
    throw new Error(error.response?.data?.message || `Failed to ${type} data`);
  }
};

export default useServer;
