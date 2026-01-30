import api from '../../interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function updateNodeSortIndices<T>({
  updates,
}: {
  updates: Array<T>;
}) {
  return api.post('/glossary/node/sort', { updates }).then((res: any) => {
    return res.data;
  });
}
