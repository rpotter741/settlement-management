import api from '../../interceptor.js';

export default async function updateSubTypeDefinition({
  id,
  updates,
}: {
  id: string;
  updates: Array<{
    subTypeId: string;
    keypath: string;
    value: any;
  }>;
}) {
  return api
    .post('/glossary/subTypes/update', { id, updates })
    .then((res: any) => {
      return res.data;
    });
}
