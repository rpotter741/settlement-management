import api from '../interceptor.js';

export default async function deleteGlossary({
  glossaryId,
}: {
  glossaryId: string;
}) {
  return api.post('/glossary/delete', { id: glossaryId }).then((res: any) => {
    return res.data;
  });
}
