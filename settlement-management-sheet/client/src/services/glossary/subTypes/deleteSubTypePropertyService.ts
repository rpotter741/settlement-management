import api from '../../interceptor.js';

const deleteSubTypePropertyService = async ({
  propertyId,
}: {
  propertyId: string;
}) => {
  return api
    .post('/glossary/subTypes/properties/delete', { propertyId })
    .then((res: any) => {
      return res.data;
    });
};

export default deleteSubTypePropertyService;
