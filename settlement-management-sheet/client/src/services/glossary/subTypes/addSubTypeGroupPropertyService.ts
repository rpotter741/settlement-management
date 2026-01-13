import api from '../../interceptor.js';

export default async function addSubTypeGroupPropertyService({
  groupId,
  propertyId,
  order,
}: {
  groupId: string;
  propertyId: string;
  order: number;
}) {
  return api
    .post('/glossary/subtypes/groups/properties', {
      groupId,
      propertyId,
      order,
    })
    .then((res: any) => {
      return res.data;
    });
}
