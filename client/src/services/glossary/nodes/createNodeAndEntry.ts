import api from '../../interceptor.js';

export default async function createNodeAndEntry({
  entryData,
}: {
  entryData: any;
}) {
  return api
    .post('/glossary/nodes/create', {
      entryData,
    })
    .then((res: any) => {
      return res.data;
    });
}
