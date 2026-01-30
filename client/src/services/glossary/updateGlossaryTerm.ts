import api from '../interceptor.js';

export default async function updateGlossaryTerm({
  id,
  key,
  value,
}: {
  id: string;
  key: string;
  value: any;
}) {
  return api
    .post('/glossary/term/update', { id, key, value })
    .then((res: any) => {
      return res.data;
    });
}
