import api from '../../interceptor.js';

export default async function fetchSystemSubTypes() {
  return api.get(`glossary/subTypes/system`).then((res: any) => {
    return res.data;
  });
}
