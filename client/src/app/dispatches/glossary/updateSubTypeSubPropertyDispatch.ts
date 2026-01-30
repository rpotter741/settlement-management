import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';
import { updateSubTypeSubProperty } from '@/app/slice/glossarySlice.js';

export function updateSubTypeSubPropertyDispatch({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  side,
  keypath,
  value,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertyId: string;
  side: 'left' | 'right';
  keypath: string;
  value: any;
}) {
  dispatch(
    updateSubTypeSubProperty({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      side,
      keypath,
      value,
    })
  );
}
