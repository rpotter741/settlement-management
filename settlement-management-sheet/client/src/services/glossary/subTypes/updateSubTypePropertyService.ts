import { SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import { GenericObject } from '../../../../../shared/types/common.js';
import api from '../../interceptor.js';

export default async function updateSubTypePropertyService({
  propertyId,
  updates,
}: {
  propertyId: string;
  updates: Partial<SubTypeGroup>;
}) {
  return api
    .patch(`/glossary/subTypes/properties/update`, { propertyId, updates })
    .then((res: any) => {
      return res.data;
    });
}
