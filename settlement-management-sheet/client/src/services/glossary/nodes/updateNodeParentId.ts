import api from '../../interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function updateNodeParentId({
  ids,
  parentId,
}: {
  ids: string[];
  parentId: string | null;
}) {
  return api
    .post('/glossary/node/parent', { ids, parentId })
    .then((res: any) => {
      return res.data;
    });
}
