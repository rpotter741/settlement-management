import api from '@/services/interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function getEntryById({
  nodeId,
  entryType,
}: {
  nodeId: string;
  entryType: GlossaryEntryType;
}) {
  return api
    .get(`/glossary/entries/${entryType}/${nodeId}`, {
      params: { id: nodeId, entryType },
    })
    .then((res: any) => {
      return res.data;
    });
}
