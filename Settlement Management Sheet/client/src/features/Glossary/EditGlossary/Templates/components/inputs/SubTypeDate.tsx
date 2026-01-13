import { Box } from '@mui/material';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';

const SubTypeDate = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
  mode,
  propertyId,
  handleChange,
}: {
  property: any;
  mode: 'focus' | 'form' | 'preview';
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  handleChange: (value: any, keypath: string) => void;
}) => {
  const { isCompound } = useCompoundBridge({
    glossaryId,
    type,
    subTypeId,
    groupId,
    propertyId,
    property,
  });

  return (
    <>
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        glossaryId={glossaryId}
        type={type}
        subTypeId={subTypeId}
        groupId={groupId}
        propertyId={propertyId}
        isCompound={isCompound}
      />
    </>
  );
};

export default SubTypeDate;
