import api from '../interceptor.js';

export default async function getGlossaryById({
  glossaryId,
}: {
  glossaryId: string;
}) {
  return api
    .get(`glossary/${glossaryId}`, { params: { glossaryId } })
    .then((res: any) => {
      return res.data;
    });
}
