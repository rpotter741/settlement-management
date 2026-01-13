import api from '../../interceptor.js';

export default async function updateSubTypeContextService({
  subtypeId,
  context,
}: {
  subtypeId: string;
  context: string[];
}) {
  return api
    .patch(`/glossary/subtypes/context/update`, { subtypeId, context })
    .then((res: any) => {
      return res.data;
    });
}
