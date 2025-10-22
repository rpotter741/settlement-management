import { Box, Divider } from '@mui/material';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import { useEffect, useMemo, useState } from 'react';
import { propertyTypeComponentMap } from '../FocusOrchestrator.js';
import { SubTypePropertyTypes } from '../../generics/genericContinent.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import { SubTypeCompoundData } from '../types.js';
import generatePropertyValue, {
  generateCompoundPropertyValue,
} from '@/features/Glossary/utils/generatePropertyValue.js';
import SubTypeCompoundPreview from '../previews/SubTypeCompoundPreview.js';

const SubTypeCompound = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
  mode,
  propertyId,
}: {
  property: any;
  mode: 'focus' | 'form' | 'preview';
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
}) => {
  const { handleChange } = useCompoundBridge({
    glossaryId,
    type,
    subTypeId,
    groupId,
    propertyId,
    property,
  });
  //
  const [source, setSource] = useState(
    generateCompoundPropertyValue(property, propertyId)
  );

  const onChange = ({
    vId,
    side,
    value,
  }: {
    vId: string;
    side: 'left' | 'right';
    value: any;
  }) => {
    const newSource = { ...source };
    newSource.value[vId][side]!.value = value;
    setSource(newSource);
  };

  const LeftComponent = useMemo(() => {
    return propertyTypeComponentMap[property.left.type as SubTypePropertyTypes];
  }, [property.left]);

  const RightComponent = useMemo(() => {
    return propertyTypeComponentMap[
      property.right.type as SubTypePropertyTypes
    ];
  }, [property.right]);

  const onAddData = () => {
    const newData = generateCompoundPropertyValue(property, propertyId);
    const addition = newData.value[newData.order[0]];
    setSource((prev) => ({
      ...prev,
      value: {
        ...prev.value,
        [newData.order[0]]: addition,
      },
      order: [...prev.order, newData.order[0]],
    }));
  };

  const onRemove = (id: string) => {
    setSource((prev) => {
      const newValue = { ...prev.value };
      delete newValue[id];
      return {
        ...prev,
        value: newValue,
        order: prev.order.filter((orderId) => orderId !== id),
      };
    });
  };

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
            glossaryId={glossaryId}
            type={type}
            subTypeId={subTypeId}
            groupId={groupId}
            propertyId={propertyId}
            mode="form"
            property={property.left}
            subPropertySide={'left'}
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
            glossaryId={glossaryId}
            type={type}
            subTypeId={subTypeId}
            groupId={groupId}
            propertyId={propertyId}
            mode="form"
            property={property.right}
            subPropertySide={'right'}
          />
        </Box>
      </Box>

      {mode === 'focus' && (
        <SubTypePreviewWrapper>
          <SubTypeCompoundPreview
            property={property}
            onChange={({
              value,
              side,
              vId,
            }: {
              value: any;
              side?: 'left' | 'right';
              vId?: string;
            }) => onChange({ value, side: side!, vId: vId! })}
            isPreview={true}
            source={source}
            onAddData={onAddData}
            onRemove={onRemove}
          />
        </SubTypePreviewWrapper>
      )}
    </>
  );
};

export default SubTypeCompound;
