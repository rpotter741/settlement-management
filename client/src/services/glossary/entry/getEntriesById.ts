import api from '@/services/interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function getEntriesById({
  nodeIds,
}: {
  nodeIds: string[];
}) {
  return api.post(`/glossary/entries/`, { ids: nodeIds }).then((res: any) => {
    return res.data;
  });
}
