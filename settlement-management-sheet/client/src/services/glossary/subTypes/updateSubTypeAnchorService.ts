import { SemanticAnchors, SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import { GenericObject } from '../../../../../shared/types/common.js';
import api from '../../interceptor.js';

export default async function updateSubTypeAnchorService({
  subtypeId,
  anchors,
}: {
  subtypeId: string;
  anchors: SemanticAnchors;
}) {
  return api
    .patch(`/glossary/subtypes/anchor/update`, { subtypeId, anchors })
    .then((res: any) => {
      return res.data;
    });
}
