import api from '@/services/interceptor.js';

export default async function getEntryById({
  id,
  subModel,
  updates,
}: {
  id: string;
  subModel: string;
  updates: any;
}) {
  return api
    .patch(`/glossary/entry/subModel/update`, {
      params: { id, subModel },
      data: updates,
    })
    .then((res: any) => {
      return res.data;
    });
}
