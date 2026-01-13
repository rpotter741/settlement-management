import { dispatch } from '@/app/constants.js';
import { updateAllSubTypeGroupData } from '@/app/slice/glossarySlice.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';

export default function updateAllSubTypeGroupDataDispatch({
  glossaryId,
  type,
  subTypeId,
  groupData,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupData: any;
}) {
  dispatch(
    updateAllSubTypeGroupData({
      glossaryId,
      type,
      subTypeId,
      groupData,
    })
  );
}
