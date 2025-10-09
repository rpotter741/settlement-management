import { GlossaryEntryType } from 'types/index.js';
import api from '../../interceptor.js';

export default async function createNodeAndSection({
  id,
  name,
  entryType,
  fileType = 'detail',
  parentId,
  glossaryId,
  entryData,
}: {
  id: string;
  name: string;
  entryType: GlossaryEntryType | null;
  fileType: 'detail';
  parentId: string | null;
  glossaryId: string;
  entryData: any;
}) {
  return api
    .post('/glossary/detail', {
      id,
      name,
      entryType,
      fileType,
      parentId,
      glossaryId,
      entryData,
    })
    .then((res: any) => {
      return res.data;
    });
}
