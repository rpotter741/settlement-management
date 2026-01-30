import { dispatch } from '@/app/constants.js';
import { changeSubTypeGroupName } from '@/app/slice/glossarySlice.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';

export default function changeSubTypeGroupNameDispatch({
  glossaryId,
  type,
  subTypeId,
  groupId,
  name,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  name: string;
}) {
  dispatch(
    changeSubTypeGroupName({
      glossaryId,
      type,
      subTypeId,
      groupId,
      name,
    })
  );
}
