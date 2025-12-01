import api from '../../interceptor.js';

export default async function reorderPropertyFromGroupService({
  groupId,
  newOrder,
}: {
  groupId: string;
  newOrder: string[];
}) {
  return api
    .post('/glossary/subtypes/groups/properties/reorder', {
      groupId,
      newOrder,
    })
    .then((res: any) => {
      console.log(res.message);
      return res.data;
    });
}
