import api from '../../interceptor.js';

export default async function removeGroupsFromSubTypeService({
  linkIds,
  subtypeId,
}: {
  linkIds: string[];
  subtypeId: string;
}) {
  return api
    .post('/glossary/subtypes/removeGroups', {
      linkIds,
      subtypeId,
    })
    .then((res: any) => {
      return res.data;
    });
}
