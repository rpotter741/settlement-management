import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { GlossaryEntryType } from '../../../../../../../../shared/types/index.js';
import FieldDefinition from '../../wrappers/FieldDefinition.js';
import FieldRow from '../../wrappers/FieldRow.js';
import SubTypeSelectWrapper from '../toggles/SubTypeSelectWrapper.js';
import { useState } from 'react';
import { Compress, Delete, Expand } from '@mui/icons-material';
import { DropZone } from '@/components/index.js';
import { useDrag, useDrop } from 'react-dnd';
import DraggableRangeOption from '../DnD/DraggableRangeOption.js';
import { RangeOptionsDragProvider } from '@/context/DnD/RangeOptionsDragContext.js';
import useCompoundBridge from '../../hooks/useCompoundBridge.js';
import SubTypePreviewWrapper from '../previews/SubTypePreviewWrapper.js';
import SubTypeRangePreview from '../previews/SubTypeRangePreview.js';
import generatePropertyValue from '@/features/Glossary/utils/generatePropertyValue.js';
import { SubTypeRangeData } from '../types.js';
import { SubTypeModes } from '@/features/SidePanel/Glossary/SubTypeManager/SubTypeSidebarOrchestrator.js';
import { SubTypeProperty } from '@/app/slice/subTypeSlice.js';

const SubTypeRange = ({
  property,
  mode,
  propertyId,
  subPropertySide,
  source,
  onChange,
  subPropertyParent,
}: {
  property: any;
  mode: SubTypeModes;
  propertyId: string;
  subPropertySide?: 'left' | 'right';
  subPropertyParent?: SubTypeProperty;
  source: any;
  onChange: (value: any, keypath: string) => void;
}) => {
  const [hoverString, setHoverString] = useState('');
  const [expand, setExpand] = useState(false);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { handleTransform, handleChange, isCompound } = useCompoundBridge({
    propertyId,
    property,
    subPropertySide,
    subPropertyParent,
  });

  const reorderList = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;
    const order = Array.from(property.shape.options);
    const [movedItem] = order.splice(sourceIndex, 1);
    order.splice(destinationIndex, 0, movedItem);
    handleChange(order, 'shape.options');
  };

  //local shit baby!
  const [localState, setLocalState] = useState({ value: 0 });
  const handleLocalChange = (value: number) => {
    setLocalState({ value });
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        columnGap: 2,
      }}
    >
      <FieldDefinition
        mode={mode}
        property={property}
        handleChange={handleChange}
        propertyId={propertyId}
        sx={{ gridColumn: 'span 3' }}
        isCompound={isCompound}
        side={subPropertySide}
        subPropertyParent={subPropertyParent}
      >
        {mode === 'property' && (
          <FieldRow
            label="Range Type"
            mode={mode}
            sx={{ gridColumn: 'span 1' }}
          >
            <SubTypeSelectWrapper
              property={property}
              mode={mode}
              onChange={(e) =>
                handleTransform(e.target.value, 'shape.isNumber')
              }
              label="Range Type"
              keypath="shape.isNumber"
              options={[
                { name: 'Number', value: true },
                { name: 'Text', value: false },
              ]}
            />
          </FieldRow>
        )}
      </FieldDefinition>
      {mode === 'group' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gridColumn: 'span 3',
            flexDirection: mode === 'group' ? 'row' : 'column',
            gap: 2,
          }}
        >
          <FieldRow
            label="Range Type"
            mode={mode}
            sx={{ gridColumn: 'span 1' }}
          >
            <SubTypeSelectWrapper
              property={property}
              mode={mode}
              onChange={(e) =>
                handleTransform(e.target.value, 'shape.isNumber')
              }
              label="Range Type"
              keypath="shape.isNumber"
              options={[
                { name: 'Number', value: true },
                { name: 'Text', value: false },
              ]}
            />
          </FieldRow>
        </Box>
      )}
      {property.shape.isNumber && (
        <>
          <Box
            sx={{
              display: 'flex',
              gridColumn: 'span 3',
              flexDirection: mode === 'group' ? 'row' : 'column',
            }}
          >
            <FieldRow label="Minimum" mode={mode} sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                type="number"
                value={Number(property.shape.min)}
                onChange={(e) => handleChange(e.target.value, 'shape.min')}
                label="Minimum"
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleChange(0, 'shape.min');
                  }
                }}
              />
            </FieldRow>
            <FieldRow
              label="Maximum"
              mode={mode}
              sx={{ gridColumn: mode === 'group' ? 'span 1' : 'span 3' }}
            >
              <TextField
                fullWidth
                type="number"
                value={Number(property.shape.max)}
                onChange={(e) => handleChange(e.target.value, 'shape.max')}
                label="Maximum"
                onBlur={(e) => {
                  if (e.target.value === '') {
                    handleChange(100, 'shape.max');
                  }
                }}
              />
            </FieldRow>
            <FieldRow
              label="Step"
              mode={mode}
              sx={{ gridColumn: mode === 'group' ? 'span 1' : 'span 3' }}
            >
              <TextField
                fullWidth
                type="number"
                value={property.shape.step}
                onChange={(e) => {
                  const value =
                    Number(e.target.value) >= 1 ? Number(e.target.value) : 1;
                  handleChange(value, 'shape.step');
                }}
                label="Step"
              />
            </FieldRow>
          </Box>
        </>
      )}
      {!property.shape.isNumber && (
        <FieldRow
          label="Steps"
          mode={mode}
          sx={{ gridColumn: 'span 3', mt: mode === 'property' ? 1 : 0 }}
        >
          <TextField
            variant="outlined"
            label={'Steps'}
            placeholder="Enter a Step and Press Enter"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value.length === 0) return;
                const currentOptions = property?.shape.options || [];
                if (currentOptions.includes(value)) return;
                handleChange([...currentOptions, value], 'shape.options');
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </FieldRow>
      )}
      {!property.shape.isNumber && (
        <FieldRow
          label="Defined Steps"
          mode={mode}
          alignItems="start"
          sx={{ gridColumn: 'span 3', mt: mode === 'property' ? 1 : 0 }}
        >
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Box
              sx={{
                maxHeight: expand ? '100%' : '120px',
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                py: 0.5,
                minHeight: 46,
                width: '100%',
              }}
            >
              {property.shape.options && property.shape.options.length > 3 && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                  size="small"
                  onClick={() => setExpand(!expand)}
                >
                  {expand ? <Compress /> : <Expand />}
                </IconButton>
              )}
              <RangeOptionsDragProvider>
                {(property.shape.options || []).map(
                  (option: string, index: number) => (
                    <DraggableRangeOption
                      key={option}
                      index={index}
                      option={option}
                      property={property}
                      handleChange={handleChange}
                      setHoverString={setHoverString}
                      hoverString={hoverString}
                      hoverIndex={hoverIndex}
                      setHoverIndex={setHoverIndex}
                      reorderList={reorderList}
                    />
                  )
                )}
              </RangeOptionsDragProvider>
            </Box>
            <Typography
              variant="caption"
              sx={{
                width: '100%',
                textAlign: 'left',
                position: 'absolute',
                left: 18,
                bottom: -22,
              }}
            >
              {property?.shape.options?.length !== 1
                ? `${property?.shape.options?.length || 0} steps defined`
                : '1 step defined'}
            </Typography>
          </Box>
        </FieldRow>
      )}
      {mode === 'property' && (
        <Box sx={{ gridColumn: 'span 3', mt: 2, width: '100%' }}>
          <SubTypePreviewWrapper>
            <SubTypeRangePreview
              property={property}
              onChange={handleLocalChange}
              source={localState}
              keypath={''}
            />
          </SubTypePreviewWrapper>
        </Box>
      )}
    </Box>
  );
};

export default SubTypeRange;
