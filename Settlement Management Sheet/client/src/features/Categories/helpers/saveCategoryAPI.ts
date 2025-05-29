import api from 'services/interceptor.ts';

const saveCategoryAPI = async (category) => {
  const modifiedCategory = {
    ...category,
    contentType: 'OFFICIAL',
    createdBy: 'Admin',
  };
  try {
    const { data } = await api.post('categories/save', modifiedCategory);
    return data;
  } catch (error) {
    console.error('API error:', error.message);
    throw new Error(error.response?.data?.message || 'Failed to save category');
  }
};

export default saveCategoryAPI;
