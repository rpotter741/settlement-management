import { dispatch } from '@/app/constants.js';
import { reorderSubTypeGroups } from '@/app/slice/glossarySlice.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';

export default function reorderSubTypeGroupsDispatch({
  glossaryId,
  type,
  subTypeId,
  newOrder,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  newOrder: string[];
}) {
  dispatch(
    reorderSubTypeGroups({
      glossaryId,
      type,
      subTypeId,
      newOrder,
    })
  );
}
