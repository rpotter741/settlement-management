import api from '../../interceptor.js';

const deleteSubTypeService = async ({ subTypeId }: { subTypeId: string }) => {
  console.log('Deleting SubType with ID:', subTypeId);
  return api
    .post('/glossary/subTypes/delete', { subTypeId })
    .then((res: any) => {
      return res.data;
    });
};

export default deleteSubTypeService;
