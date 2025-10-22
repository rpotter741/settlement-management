import { Box, TextField } from '@mui/material';
import FieldRow from './FieldRow.js';
import SubTypeSelectWrapper from '../components/toggles/SubTypeSelectWrapper.js';
import {
  SubTypePropertyTypes,
  subTypePropertyTypes,
} from '../generics/genericContinent.js';
import { propertyTypeLabelMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import {
  createAndDispatchDefaultProperty,
  createAndDispatchDefaultSubProperty,
} from '@/app/dispatches/glossary/changeSubTypePropertyDispatch.js';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';

const FieldDefinition = ({
  glossaryId,
  type,
  subTypeId,
  propertyId,
  groupId,
  mode,
  property,
  handleChange,
  children,
  sx = {},
  side,
  isCompound,
}: {
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  propertyId: string;
  groupId: string;
  mode: 'focus' | 'form' | 'preview';
  property: any;
  handleChange: (value: any, key: string) => void;
  children?: React.ReactNode;
  isCompound: boolean;
  side?: 'left' | 'right';
  sx?: any;
}) => {
  const subTypePropertyTypesFiltered = isCompound
    ? subTypePropertyTypes.filter(
        (t) =>
          t === 'dropdown' || t === 'text' || t === 'checkbox' || t === 'range'
      )
    : subTypePropertyTypes;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: mode === 'focus' ? 'column' : 'row',
        alignItems: mode === 'focus' ? 'flex-start' : 'center',
        gap: 2,
        width: '100%',
        flex: 1,
        ...sx,
      }}
    >
      <FieldRow
        flex={2}
        label="Property Name"
        mode={mode}
        sx={{ gridColumn: 'span 2' }}
      >
        <TextField
          label={mode === 'focus' ? '' : 'Property Name'}
          sx={{ flex: 3, width: '100%' }}
          value={property.name}
          onChange={(e) => handleChange(e.target.value, 'name')}
          variant="outlined"
          placeholder="Enter text..."
        />
      </FieldRow>
      <Box sx={{ display: 'flex', width: '100%', flex: 2, gap: 2 }}>
        <FieldRow label="Property Type" mode={mode}>
          <SubTypeSelectWrapper
            onChange={(e) => {
              if (isCompound) {
                return createAndDispatchDefaultSubProperty({
                  glossaryId,
                  type,
                  subTypeId,
                  propertyId,
                  groupId,
                  propertyType: e.target.value as SubTypePropertyTypes,
                  name: property.name,
                  side: side!,
                });
              }
              createAndDispatchDefaultProperty({
                glossaryId,
                type,
                subTypeId,
                propertyId,
                groupId,
                propertyType: e.target.value as SubTypePropertyTypes,
                name: property.name,
              });
            }}
            property={property}
            mode={mode}
            options={subTypePropertyTypesFiltered.map((type) => ({
              name: propertyTypeLabelMap[type] as string,
              value: type,
            }))}
            keypath="type"
            label="Property Type"
          />
        </FieldRow>
        {mode === 'form' && children}
      </Box>
      {mode === 'focus' && children}
    </Box>
  );
};

export default FieldDefinition;
