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
import { useGenericContext } from '@/context/GenericContext.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';

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
  propertyId,
  mode,
}: {
  propertyId: string;
  mode: SubTypeModes;
}) => {
  const { source, setSource, handleChange, onRemove, onAddData } =
    useGenericContext();
  //
  const property = useSelector(
    selectSubTypePropertyById({
      propertyId,
    })
  );

  if (!property) return null;

  const Component =
    propertyTypeComponentMap[property.inputType as SubTypePropertyTypes] || Box;

  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        maxWidth: 800,
        mt: 6,
        px: 4,
      }}
    >
      <Component
        property={property}
        mode={mode}
        propertyId={propertyId}
        source={source}
        setSource={setSource}
        onChange={handleChange}
        onRemove={onRemove}
        onAddData={onAddData}
      />
    </Box>
  );
};

export default FocusOrchestrator;
