import api from '@/services/interceptor.js';

export default async function changeEntrySubTypeService({
  entryId,
  newSubTypeId,
}: {
  entryId: string;
  newSubTypeId: string;
}) {
  const { data } = await api.post('/glossary/entry/change-sub-type', {
    entryId,
    newSubTypeId,
  });
  return data;
}
