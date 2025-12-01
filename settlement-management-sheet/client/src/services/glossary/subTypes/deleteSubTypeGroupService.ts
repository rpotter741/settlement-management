import api from '../../interceptor.js';

const deleteSubTypeGroupService = async ({ groupId }: { groupId: string }) => {
  return api
    .post('/glossary/subTypes/groups/delete', { groupId })
    .then((res: any) => {
      return res.data;
    });
};

export default deleteSubTypeGroupService;
