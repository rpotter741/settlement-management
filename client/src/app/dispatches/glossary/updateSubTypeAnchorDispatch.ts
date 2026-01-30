import { dispatch } from '@/app/constants.js';
import { GlossaryEntryType } from '../../../../../shared/types/index.js';
import { updateSubTypeAnchor } from '@/app/slice/glossarySlice.js';

export function updateSubTypeAnchorDispatch({
  anchor,
  value,
  subTypeId,
  type,
  glossaryId,
}: {
  anchor: 'primary' | 'secondary';
  value: string | null;
  subTypeId: string;
  type: GlossaryEntryType;
  glossaryId: string;
}) {
  dispatch(
    updateSubTypeAnchor({
      anchor,
      value,
      subTypeId,
      type,
      glossaryId,
    })
  );
}
