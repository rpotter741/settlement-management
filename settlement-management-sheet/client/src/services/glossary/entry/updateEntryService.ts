import api from '@/services/interceptor.js';

export default async function updateEntryService({
  id,
  subTypeId,
  groups,
  primaryAnchorValue,
  secondaryAnchorValue,
}: {
  id: string;
  subTypeId: string;
  groups: any;
  primaryAnchorValue: string;
  secondaryAnchorValue: string;
}) {
  return api
    .patch(`/glossary/entry/update`, {
      id,
      subTypeId,
      groups,
      primaryAnchorValue,
      secondaryAnchorValue,
    })
    .then((res: any) => {
      return res.data;
    });
}
