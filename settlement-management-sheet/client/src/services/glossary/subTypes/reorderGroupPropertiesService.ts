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
      return res.data;
    });
}
