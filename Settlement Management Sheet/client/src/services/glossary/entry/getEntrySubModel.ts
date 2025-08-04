import api from '@/services/interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function getEntryById({
  id,
  entryType,
  subModel,
}: {
  id: string;
  entryType: GlossaryEntryType;
  subModel: string;
}) {
  return api
    .get(`/glossary/entry/subModel`, {
      params: { id, entryType, subModel },
    })
    .then((res: any) => {
      return res.data;
    });
}
