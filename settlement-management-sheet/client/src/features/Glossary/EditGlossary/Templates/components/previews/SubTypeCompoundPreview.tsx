import { useCallback, useMemo, useState } from 'react';
import SubTypeCheckBoxPreview from './SubTypeCheckboxPreview.js';
import SubTypeDropdownPreview from './SubTypeDropdownPreview.js';
import SubTypeRangePreview from './SubTypeRangePreview.js';
import SubTypeTextPreview from './SubTypeTextPreview.js';
import { GenericObject } from '../../../../../../../../shared/types/common.js';
import { Box, Button, IconButton } from '@mui/material';
import { SubTypeCompoundData } from '../types.js';
import generatePropertyValue from '@/features/Glossary/utils/generatePropertyValue.js';
import { propertyTypeComponentMap } from '../PropertyOrchestrator.js';
import { Delete } from '@mui/icons-material';
import useTheming from '@/hooks/layout/useTheming.js';

const SubTypeCompoundPreviewMap = {
  range: SubTypeRangePreview,
  dropdown: SubTypeDropdownPreview,
  text: SubTypeTextPreview,
  checkbox: SubTypeCheckBoxPreview,
  // Add other sub-type previews as needed
};

const SubTypeCompoundPreview = ({
  property,
  onChange,
  source,
  onAddData,
  onRemove,
  keypath,
  liveEdit,
  glossaryId,
}: {
  property: any;
  onChange: (value: any, keypath: string) => void;
  source: any;
  onAddData: () => void;
  onRemove: (id: string, keypath: string) => void;
  keypath: string;
  liveEdit: boolean;
  glossaryId: string | null;
}) => {
  // Combine all sub-properties into a single state object
  const [values, setValues] = useState<GenericObject[]>([{}]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const { getAlphaColor } = useTheming();

  const LeftComponent =
    SubTypeCompoundPreviewMap[
      property.shape.left.inputType as keyof typeof SubTypeCompoundPreviewMap
    ] || null;
  const RightComponent =
    SubTypeCompoundPreviewMap[
      property.shape.right.inputType as keyof typeof SubTypeCompoundPreviewMap
    ] || null;

  if (!LeftComponent && !RightComponent) return null;

  const allLeftValues = useMemo(() => {
    return source?.order
      ?.map((id: string) => source?.value[id].left?.value)
      .filter((opt: string) => opt !== '');
  }, [source]);

  const allRightValues = useMemo(() => {
    return source?.order
      ?.map((id: string) => source?.value[id].right?.value)
      .filter((opt: string) => opt !== '');
  }, [source]);

  if (!source) {
    return <div>No data available</div>;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          ml: 0,
          fontWeight: 'bold',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <Box sx={{ flex: 1 }}>{property.shape.left.name}</Box>
        <Box sx={{ flex: 1 }}>{property.shape.right.name}</Box>
      </Box>
      {source?.order?.map((id: string, index: number) => {
        return (
          <Box
            key={id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              gap: 4,
              position: 'relative',
              '&:hover': {
                backgroundColor: getAlphaColor({
                  color: 'background',
                  key: 'default',
                  opacity: 0.5,
                }),
              },
              justifyContent: 'space-between',
              width: '100%',
              flex: 1,
            }}
            onMouseEnter={() => setHoverId(id)}
            onMouseLeave={() => setHoverId(null)}
          >
            <IconButton
              onClick={() => onRemove(id, keypath)}
              sx={{
                color: hoverId !== id ? 'transparent' : 'inherit',
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
              }}
            >
              <Delete />
            </IconButton>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'start',
                width: '100%',
                ml: 4,
              }}
            >
              {/* @ts-ignore */}
              <LeftComponent
                property={property.shape.left}
                onChange={onChange}
                source={source.value[id].left}
                isCompound={true}
                allSelectedValues={allLeftValues}
                side="left"
                keypath={`${keypath}.value.${id}.left`}
                liveEdit={liveEdit}
                glossaryId={glossaryId}
              />
            </Box>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* @ts-ignore */}
              <RightComponent
                property={property.shape.right}
                onChange={onChange}
                source={source.value[id].right}
                isCompound={true}
                allSelectedValues={allRightValues}
                side="right"
                keypath={`${keypath}.value.${id}.right`}
                liveEdit={liveEdit}
                glossaryId={glossaryId}
              />
            </Box>
          </Box>
        );
      })}
      {(property.shape.left.shape.optionType === 'list' &&
        source?.order?.length < property.shape.left.shape.options.length) ||
        (property.shape.left.shape.optionType === 'entryType' && (
          <Button
            variant="text"
            onClick={onAddData}
            size="small"
            sx={{ height: 31, width: 80 }}
          >
            Add Row
          </Button>
        ))}
      {property.shape.left.inputType !== 'dropdown' && (
        <Button
          variant="text"
          onClick={onAddData}
          size="small"
          sx={{ height: 31, width: 80 }}
        >
          Add Row
        </Button>
      )}
    </>
  );
};

export default SubTypeCompoundPreview;
