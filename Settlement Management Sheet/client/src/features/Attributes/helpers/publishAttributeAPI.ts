import api from 'services/interceptor.ts';

const publishAttributeAPI = async (attribute) => {
  const { refId, id } = attribute;
  try {
    const { data } = await api.post('attributes/publish', { refId, id });
    return data;
  } catch (error) {
    console.error('API error:', error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to publish attribute'
    );
  }
};

export default publishAttributeAPI;
