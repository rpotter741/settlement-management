import { selectSubTypePropertyById } from '@/app/selectors/subTypeSelectors.js';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';
import SubTypeText from './inputs/SubTypeText.js';
import SubTypeDropdown from './inputs/SubTypeDropDown.js';
import SubTypeCheckbox from './inputs/SubTypeCheckbox.js';
import SubTypeRange from './inputs/SubTypeRange.js';
import SubTypeCompound from './inputs/SubTypeCompound.js';
import { SubTypePropertyTypes } from '../generics/genericContinent.js';
import SubTypeDate from './inputs/SubTypeDate.js';

export const propertyTypeComponentMap: Record<
  SubTypePropertyTypes,
  React.FC<any>
> = {
  text: SubTypeText,
  date: SubTypeDate,
  dropdown: SubTypeDropdown,
  checkbox: SubTypeCheckbox,
  range: SubTypeRange,
  compound: SubTypeCompound,
};

const FocusOrchestrator = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  propertyId,
  mode,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  mode: 'focus' | 'form' | 'preview';
}) => {
  //
  const property = useSelector(
    selectSubTypePropertyById({
      subTypeId,
      groupId,
      propertyId,
    })
  );

  if (!property) return null;

  const Component =
    propertyTypeComponentMap[property.type as SubTypePropertyTypes] || Box;

  return (
    <Box sx={{ width: '100%', py: 2, maxWidth: 800 }}>
      <Component
        glossaryId={glossaryId}
        type={type}
        subTypeId={subTypeId}
        groupId={groupId}
        property={property}
        mode={mode}
        propertyId={propertyId}
      />
    </Box>
  );
};

export default FocusOrchestrator;
