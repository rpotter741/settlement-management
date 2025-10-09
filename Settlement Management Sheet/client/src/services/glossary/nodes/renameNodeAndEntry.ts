import { GlossaryEntryType } from 'types/index.js';
import api from '../../interceptor.js';

export default async function renameNodeAndEntry({
  id,
  entryType,
  fileType,
  name,
}: {
  id: string;
  entryType: GlossaryEntryType | null;
  fileType: 'section' | 'detail';
  name: string;
}) {
  return api
    .post('/glossary/node/rename', { id, entryType, fileType, name })
    .then((res: any) => {
      return res.data;
    });
}
