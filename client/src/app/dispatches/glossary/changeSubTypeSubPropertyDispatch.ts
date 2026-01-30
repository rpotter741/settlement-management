import { changeSubTypeSubProperty } from '@/app/slice/glossarySlice.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';
import { dispatch } from '@/app/constants.js';

export function changeSubTypeSubPropertyDispatch({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  subProperty,
  side,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subProperty: any;
  side: 'left' | 'right';
}) {
  dispatch(
    changeSubTypeSubProperty({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      subProperty,
      side,
    })
  );
}
