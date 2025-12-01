import api from '../../interceptor.js';

export default async function fetchSubTypesByUserId({
  system,
}: {
  system?: boolean;
}) {
  return api
    .get(`glossary/subTypes/user`, { params: { system } })
    .then((res: any) => {
      return res.data.subTypes;
    });
}
