import api from '../../interceptor.js';

export default async function forkSubTypeService({
  subType,
  name,
}: {
  subType: any;
  name: string;
}) {
  return api
    .post('/glossary/subTypes/fork', { subType, name })
    .then((res: any) => {
      return res.data.createdSubType[0];
    });
}
