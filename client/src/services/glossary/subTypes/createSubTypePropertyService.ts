import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import api from '../../interceptor.js';

export default async function createSubTypePropertyService({
  property,
}: {
  property: SubTypeProperty;
}) {
  return api
    .post('/glossary/subTypes/properties', { property })
    .then((res: any) => {
      return res.data;
    });
}
