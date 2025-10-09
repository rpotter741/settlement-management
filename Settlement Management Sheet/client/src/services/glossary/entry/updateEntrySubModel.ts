import api from '@/services/interceptor.js';

export default async function updateEntrySubModel({
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
      id,
      subModel,
      updates,
    })
    .then((res: any) => {
      return res.data;
    });
}
