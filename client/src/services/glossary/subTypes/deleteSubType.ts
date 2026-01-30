import api from '../../interceptor.js';

const deleteSubTypeService = async ({ subTypeId }: { subTypeId: string }) => {
  return api
    .post('/glossary/subTypes/delete', { subTypeId })
    .then((res: any) => {
      return res.data;
    });
};

export default deleteSubTypeService;
