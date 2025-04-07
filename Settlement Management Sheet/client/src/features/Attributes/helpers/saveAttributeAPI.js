import api from 'services/interceptor';

const saveAttributeAPI = async (attribute) => {
  const modifiedAttr = {
    ...attribute,
    contentType: 'OFFICIAL',
    createdBy: 'Admin',
  };
  try {
    const { data } = await api.post('attributes/save', modifiedAttr);
    return data;
  } catch (error) {
    console.error('API error:', error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to save attribute'
    );
  }
};

export default saveAttributeAPI;
