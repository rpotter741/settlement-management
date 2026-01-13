import { dispatch } from '@/app/constants.js';
import { addSubTypeToGlossary } from '@/app/slice/glossarySlice.js';

const addGlossarySubType = ({
  subType,
  setSubTypeId,
  glossaryId,
}: {
  subType: any;
  setSubTypeId: (id: string) => void;
  glossaryId: string | null;
}) => {
  dispatch(
    addSubTypeToGlossary({
      glossaryId: glossaryId || '',
      subType,
    })
  );
  setSubTypeId(subType.id);
};

export default addGlossarySubType;
