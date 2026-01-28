import { Box, TextField } from '@mui/material';
import FieldRow from './FieldRow.js';
import SubTypeSelectWrapper from '../components/toggles/SubTypeSelectWrapper.js';
import {
  SubTypePropertyTypes,
  subTypePropertyTypes,
} from '../generics/genericContinent.js';
import { propertyTypeLabelMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import { createDefaultPropertyThunk } from '@/app/thunks/glossary/subtypes/properties/createDefaultPropertyThunk.js';

import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { dispatch } from '@/app/constants.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';
import { cloneDeep, set } from 'lodash';
import { createDefaultProperty } from '@/app/dispatches/glossary/SubTypePropertyTransformations.js';
import updateSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/properties/updateSubTypePropertyThunk.js';

const FieldDefinition = ({
  propertyId,
  mode,
  property,
  handleChange,
  children,
  sx = {},
  side,
  isCompound,
  subPropertyParent,
}: {
  propertyId: string;
  mode: SubTypeModes;
  property: any;
  handleChange: (value: any, key: string) => void;
  children?: React.ReactNode;
  isCompound: boolean;
  side?: 'left' | 'right';
  sx?: any;
  subPropertyParent?: SubTypeProperty;
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
        flexDirection: mode === 'property' ? 'column' : 'row',
        alignItems: mode === 'property' ? 'flex-start' : 'center',
        gap: 2,
        width: '100%',
        flex: 1,
        flexWrap: 'wrap',
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
          label={mode === 'property' ? '' : 'Property Name'}
          sx={{ flex: 3, width: '100%' }}
          value={property.name}
          onChange={(e) => handleChange(e.target.value, 'name')}
          variant="outlined"
          placeholder="Enter name..."
        />
      </FieldRow>
      {!isCompound && (
        <FieldRow
          flex={2}
          label="Display Name"
          mode={mode}
          sx={{ gridColumn: 'span 2' }}
        >
          <TextField
            label={mode === 'property' ? '' : 'Display Name'}
            sx={{ flex: 3, width: '100%' }}
            value={property.displayName || property.name || ''}
            onChange={(e) => handleChange(e.target.value, 'displayName')}
            variant="outlined"
            placeholder="Enter display name..."
          />
        </FieldRow>
      )}
      <Box sx={{ display: 'flex', width: '100%', flex: 2, gap: 2 }}>
        <FieldRow label="Property Type" mode={mode}>
          <SubTypeSelectWrapper
            onChange={(e) => {
              if (isCompound) {
                const parentProperty = cloneDeep(
                  subPropertyParent
                ) as SubTypeProperty;
                const newProperty = createDefaultProperty(
                  e.target.value as SubTypePropertyTypes,
                  property.name,
                  propertyId
                );
                set(parentProperty, `shape.${side}`, newProperty);
                const updates = cloneDeep(parentProperty.shape);

                updateSubTypePropertyThunk({
                  propertyId: subPropertyParent?.id as string,
                  property: parentProperty,
                  updates: { shape: updates },
                });
                return;
              }
              dispatch(
                createDefaultPropertyThunk({
                  propertyId,
                  propertyType: e.target.value as SubTypePropertyTypes,
                  name: property.name,
                })
              );
            }}
            property={property}
            mode={mode}
            options={subTypePropertyTypesFiltered.map((type) => ({
              name: propertyTypeLabelMap[type] as string,
              value: type,
            }))}
            keypath="inputType"
            label="Property Type"
          />
        </FieldRow>

        {mode === 'group' && children}
      </Box>
      {mode === 'property' && children}
    </Box>
  );
};

export default FieldDefinition;
