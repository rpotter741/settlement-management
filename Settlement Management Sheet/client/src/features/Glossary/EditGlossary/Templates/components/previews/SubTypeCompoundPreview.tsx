import { useCallback, useMemo, useState } from 'react';
import SubTypeCheckBoxPreview from './SubTypeCheckboxPreview.js';
import SubTypeDropdownPreview from './SubTypeDropdownPreview.js';
import SubTypeRangePreview from './SubTypeRangePreview.js';
import SubTypeTextPreview from './SubTypeTextPreview.js';
import { GenericObject } from '../../../../../../../../shared/types/common.js';
import { Box, Button, IconButton } from '@mui/material';
import { SubTypeCompoundData } from '../types.js';
import generatePropertyValue from '@/features/Glossary/utils/generatePropertyValue.js';
import { propertyTypeComponentMap } from '../FocusOrchestrator.js';
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
  isPreview,
  source,
  onAddData,
  onRemove,
}: {
  property: any;
  onChange: ({
    value,
    side,
    vId,
  }: {
    value: any;
    side?: 'left' | 'right';
    vId?: string;
  }) => void;
  isPreview: boolean;
  source: SubTypeCompoundData;
  onAddData: () => void;
  onRemove: (id: string) => void;
}) => {
  // Combine all sub-properties into a single state object
  const [values, setValues] = useState<GenericObject[]>([{}]);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const { getAlphaColor } = useTheming();

  const LeftComponent =
    SubTypeCompoundPreviewMap[
      property.left.type as keyof typeof SubTypeCompoundPreviewMap
    ] || null;
  const RightComponent =
    SubTypeCompoundPreviewMap[
      property.right.type as keyof typeof SubTypeCompoundPreviewMap
    ] || null;

  if (!LeftComponent && !RightComponent) return null;

  const handleChange = ({
    value,
    side,
    vId,
  }: {
    value: any;
    side?: 'left' | 'right';
    vId?: string;
  }) => {
    if (!isPreview) {
      //do something
      onChange({ value, side, vId });
    } else {
      onChange({ value, side, vId });
    }
  };

  const allLeftValues = useMemo(() => {
    return source.order.map((id: string) => source.value[id].left.value);
  }, [source]);

  const allRightValues = useMemo(() => {
    return source.order.map((id: string) => source.value[id].right.value);
  }, [source]);

  return (
    <>
      {source.order.map((id: string, index: number) => {
        return (
          <Box
            key={id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              gap: 2,
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
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'start',
                width: '100%',
              }}
            >
              {/* @ts-ignore */}
              <LeftComponent
                property={property.left}
                onChange={(value: any) =>
                  handleChange({ value, side: 'left', vId: id })
                }
                isPreview={isPreview}
                source={source.value[id].left}
                isCompound={true}
                allSelectedValues={allLeftValues}
                side="left"
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
                property={property.right}
                onChange={(value: any) =>
                  handleChange({ value, side: 'right', vId: id })
                }
                isPreview={isPreview}
                source={source.value[id].right}
                isCompound={true}
                allSelectedValues={allRightValues}
                side="right"
              />
            </Box>
            <IconButton
              onClick={() => onRemove(id)}
              sx={{
                color: hoverId !== id ? 'transparent' : 'inherit',
                position: 'absolute',
                top: '50%',
                left: -28,
                transform: 'translateY(-50%)',
              }}
            >
              <Delete />
            </IconButton>
          </Box>
        );
      })}
      {property.left.optionType === 'list' &&
        source.order.length < property.left.options.length && (
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
