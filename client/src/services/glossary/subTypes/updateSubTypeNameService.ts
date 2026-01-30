import api from '../../interceptor.js';

export default async function updateSubTypeNameService({
  subtypeId,
  name,
}: {
  subtypeId: string;
  name: string;
}) {
  return api
    .patch(`/glossary/subtypes/name/update`, { subtypeId, name })
    .then((res: any) => {
      return res.data;
    });
}
