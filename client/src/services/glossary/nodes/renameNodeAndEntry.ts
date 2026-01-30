import api from '../../interceptor.js';

export default async function renameNodeAndEntry({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return api.post('/glossary/node/rename', { id, name }).then((res: any) => {
    return res.data;
  });
}
