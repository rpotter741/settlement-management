import api from '../../interceptor.js';

export default async function fetchSubTypeGroupsService({
  system,
}: {
  system?: boolean;
}) {
  return api
    .get(`glossary/subTypes/groups`, { params: { system } })
    .then((res: any) => {
      return res.data.groups;
    });
}
