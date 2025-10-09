import api from '../interceptor.js';

export default async function updateGlossary({
  id,
  updates,
}: {
  id: string;
  updates: Record<string, any>;
}) {
  return api.post('/glossary/update', { id, updates }).then((res: any) => {
    return res.data;
  });
}
