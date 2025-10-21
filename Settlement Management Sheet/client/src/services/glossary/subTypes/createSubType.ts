import api from '../../interceptor.js';

export default async function createSubType({
  glossaryId,
  subType,
}: {
  glossaryId: string;
  subType: {
    id: string;
    name: string;
    description: {
      markdown: string;
      string: string;
    };
  };
}) {
  return api
    .post('/glossary/subType/create', { glossaryId, subType })
    .then((res: any) => {
      return res.data;
    });
}
