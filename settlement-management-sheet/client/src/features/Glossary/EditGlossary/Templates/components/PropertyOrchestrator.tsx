import { selectSubTypePropertyById } from '@/app/selectors/subTypeSelectors.js';
import { Box, Button } from '@mui/material';
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
import { useRelayChannel } from '@/hooks/global/useRelay.js';
import { SmartSyncRule } from '@/features/Glossary/Modals/EditSmartSyncRule.js';
import { cloneDeep, set } from 'lodash';
import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/properties/updateSubTypePropertyThunk.js';

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

const PropertyOrchestrator = ({
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

  console.log(property);

  const saveRule = (data: SmartSyncRule & { sourceId: string }) => {
    const { sourceId, ...rest } = data;
    const updatedProperty = cloneDeep(property);
    set(updatedProperty, 'smartSync', rest);
    const updates = {
      smartSync: rest,
    };
    updateSubTypePropertyThunk({
      propertyId,
      property: updatedProperty,
      updates,
    });
  };

  useRelayChannel({
    id: 'property-smart-sync-rules',
    onComplete: (data: unknown) => {
      saveRule(data as SmartSyncRule & { sourceId: string });
    },
  });

  if (!property) return null;

  const Component =
    propertyTypeComponentMap[property.inputType as SubTypePropertyTypes] || Box;

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        pt: 4,
        maxWidth: 800,
        px: 4,
        mt: 2.5,
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

export default PropertyOrchestrator;
