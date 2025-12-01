import { SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import { GenericObject } from '../../../../../shared/types/common.js';
import api from '../../interceptor.js';

export default async function updateSubTypeGroupService({
  groupId,
  updates,
}: {
  groupId: string;
  updates: Partial<SubTypeGroup>;
}) {
  return api
    .patch(`/glossary/subTypes/groups/update`, { groupId, updates })
    .then((res: any) => {
      return res.data;
    });
}
