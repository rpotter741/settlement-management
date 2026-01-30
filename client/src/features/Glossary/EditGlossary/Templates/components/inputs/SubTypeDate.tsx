import { Box } from '@mui/material';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';

const SubTypeDate = ({
  property,
  mode,
  propertyId,
  subPropertySide,
  subPropertyParent,
}: {
  property: any;
  mode: SubTypeModes;
  propertyId: string;
  subPropertySide?: 'left' | 'right';
  subPropertyParent?: SubTypeProperty;
}) => {
  const { isCompound, handleChange } = useCompoundBridge({
    propertyId,
    property,
    subPropertySide,
    subPropertyParent,
  });

  return (
    <>
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        propertyId={propertyId}
        isCompound={isCompound}
        side={subPropertySide}
        subPropertyParent={subPropertyParent}
      />
    </>
  );
};

export default SubTypeDate;
