import api from '../interceptor.js';

export default async function deleteGlossary({ id }: { id: string }) {
  return api.post('/glossary/delete', { id }).then((res: any) => {
    return res.data;
  });
}
