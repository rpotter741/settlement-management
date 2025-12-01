import api from '../../interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function updateNodeParentId({
  id,
  parentId,
}: {
  id: string;
  parentId: string;
}) {
  return api
    .post('/glossary/node/parent', { id, parentId })
    .then((res: any) => {
      return res.data;
    });
}
