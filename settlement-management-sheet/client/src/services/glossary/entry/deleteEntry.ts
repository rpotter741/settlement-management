import api from '../../interceptor.js';

export default async function deleteEntry({
  id,
  glossaryId,
}: {
  id: string;
  glossaryId: string;
}) {
  return api
    .post('/glossary/entry/delete', { id, glossaryId })
    .then((res: any) => {
      return res.data;
    });
}
