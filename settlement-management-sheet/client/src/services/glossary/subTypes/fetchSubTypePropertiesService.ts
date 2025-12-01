import api from '../../interceptor.js';

export default async function fetchSubTypeProperties({
  system,
}: {
  system?: boolean;
}) {
  return api
    .get(`glossary/subTypes/properties`, { params: { system } })
    .then((res: any) => {
      return res.data.properties;
    });
}
