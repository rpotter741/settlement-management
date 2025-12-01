import { Box, Divider } from '@mui/material';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import { useEffect, useMemo, useState } from 'react';
import { propertyTypeComponentMap } from '../PropertyOrchestrator.js';
import { SubTypePropertyTypes } from '../../generics/genericContinent.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import { SubTypeCompoundData } from '../types.js';
import generatePropertyValue, {
  generateCompoundPropertyValue,
} from '@/features/Glossary/utils/generatePropertyValue.js';
import SubTypeCompoundPreview from '../previews/SubTypeCompoundPreview.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';

const SubTypeCompound = ({
  property,
  mode,
  propertyId,
  source,
  onChange,
  onAddData,
  onRemove,
}: {
  property: any;
  mode: SubTypeModes;
  propertyId: string;
  source: any;
  onChange: (value: any, keypath: string) => void;
  onAddData: (sourceProperty: any, groupId: string, propertyId: string) => void;
  onRemove: () => void;
}) => {
  const { handleChange } = useCompoundBridge({
    propertyId,
    property,
  });

  const LeftComponent = useMemo(() => {
    return propertyTypeComponentMap[
      property.shape.left.inputType as SubTypePropertyTypes
    ];
  }, [property.shape.left]);

  const RightComponent = useMemo(() => {
    return propertyTypeComponentMap[
      property.shape.right.inputType as SubTypePropertyTypes
    ];
  }, [property.shape.right]);

  // local state for preview
  const [localSource, setLocalSource] = useState<SubTypeCompoundData>(
    generateCompoundPropertyValue(property, property.id) as SubTypeCompoundData
  );

  const handleLocalChange = (value: any, keypath: string) => {
    setLocalSource((prev) => {
      const updated = { ...prev };
      const keys = keypath.split('.');
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleAddLocalData = () => {};
  const onRemoveLocalData = () => {};

  return (
    <>
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        propertyId={propertyId}
        isCompound={false}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          gap: 2,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
          }}
        >
          <LeftComponent
            propertyId={propertyId}
            mode={'group'} //not passing mode for proper rendering inside compound
            property={property.shape.left}
            subPropertySide={'left'}
            subPropertyParent={property}
          />
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: 'secondary.light' }}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <RightComponent
            propertyId={propertyId}
            mode={'group'} //not passing mode for proper rendering inside compound
            property={property.shape.right}
            subPropertySide={'right'}
            subPropertyParent={property}
          />
        </Box>
      </Box>

      {mode === 'property' && (
        <SubTypePreviewWrapper>
          <SubTypeCompoundPreview
            property={property}
            onChange={handleLocalChange}
            source={localSource}
            onAddData={handleAddLocalData}
            onRemove={onRemoveLocalData}
            keypath={``}
            liveEdit={false}
            glossaryId=""
          />
        </SubTypePreviewWrapper>
      )}
    </>
  );
};

export default SubTypeCompound;
