import api from '../../interceptor.js';

export default async function removePropertyFromGroupService({
  linkId,
  newGroupDisplay,
  groupId,
}: {
  linkId: string;
  newGroupDisplay: Record<string, any>;
  groupId: string;
}) {
  return api
    .post('/glossary/subtypes/groups/properties/delete', {
      linkId,
      newGroupDisplay,
      groupId,
    })
    .then((res: any) => {
      console.log(res.message);
      return res.data;
    });
}
