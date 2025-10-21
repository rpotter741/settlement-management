import { dispatch } from '@/app/constants.js';
import { removeSubTypeGroup } from '@/app/slice/glossarySlice.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';

export default function removeSubTypeGroupDispatch(
  glossaryId: string,
  type: GlossaryEntryType,
  subTypeId: string,
  groupId: string
) {
  dispatch(
    removeSubTypeGroup({
      glossaryId,
      type,
      subTypeId,
      groupId,
    })
  );
}
