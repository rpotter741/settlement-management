import api from '../../interceptor.js';

export default async function addGroupToSubTypeService({
  groupId,
  subtypeId,
  order,
}: {
  groupId: string;
  subtypeId: string;
  order: number;
}) {
  return api
    .post('/glossary/subtypes/addGroup', {
      groupId,
      subtypeId,
      order,
    })
    .then((res: any) => {
      return res.data;
    });
}
