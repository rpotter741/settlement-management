import api from 'services/interceptor.js';

const useServer = async ({ tool, type, data }) => {
  const { refId, id } = data;

  const actions = {
    save: () =>
      api.post(`/${tool}/save`, {
        ...data,
        contentType: 'OFFICIAL',
        createdBy: 'Admin',
      }),
    publish: () => api.post(`/${tool}/publish`, { refId, id }),
    delete: () => api.post(`/${tool}/delete`, { refId }),
  };

  try {
    if (!actions[type]) {
      throw new Error(`Unknown server action: ${type}`);
    }

    const response = await actions[type]();
    return response.data;
  } catch (error) {
    console.error('API error:', error.message);
    throw new Error(error.response?.data?.message || `Failed to ${type} data`);
  }
};

export default useServer;
