import { SubTypeGroup, SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import api from '../../interceptor.js';

export default async function createSubTypeGroupService({
  group,
}: {
  group: SubTypeGroup;
}) {
  return api.post('/glossary/subTypes/groups', { group }).then((res: any) => {
    return res.data;
  });
}
