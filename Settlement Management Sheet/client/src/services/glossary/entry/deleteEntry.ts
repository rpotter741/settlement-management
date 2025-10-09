import api from '../../interceptor.js';
import { GlossaryEntryType } from 'types/index.js';

export default async function deleteEntry({
  id,
  entryType,
  fileType,
  glossaryId,
}: {
  id: string;
  entryType: GlossaryEntryType;
  fileType: 'section' | 'detail';
  glossaryId: string;
}) {
  return api
    .post('/glossary/entry/delete', { id, entryType, fileType, glossaryId })
    .then((res: any) => {
      return res.data;
    });
}
