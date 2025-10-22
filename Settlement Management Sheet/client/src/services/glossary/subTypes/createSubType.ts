import api from '../../interceptor.js';

export default async function createSubType({
  subType,
}: {
  subType: {
    id: string;
    name: string;
    description: {
      markdown: string;
      string: string;
    };
  };
}) {
  return api.post('/glossary/subTypes/create', { subType }).then((res: any) => {
    return res.data;
  });
}
