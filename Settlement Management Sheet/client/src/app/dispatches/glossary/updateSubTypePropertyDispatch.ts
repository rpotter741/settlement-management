import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';
import { updateSubTypeProperty } from '@/app/slice/glossarySlice.js';

export function updateSubTypeDispatch({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  keypath,
  value,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  keypath: string;
  value: any;
}) {
  console.log(keypath);
  dispatch(
    updateSubTypeProperty({
      glossaryId,
      type,
      subTypeId,
      groupId,
      propertyId,
      keypath,
      value,
    })
  );
}
