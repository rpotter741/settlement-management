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
import {
  changeSubTypePropertyDispatch,
  transformRangeInputType,
} from '@/app/dispatches/glossary/changeSubTypePropertyDispatch.js';
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

const SubTypeRange = ({
  glossaryId,
  type,
  subTypeId,
  groupId,
  property,
  mode,
  propertyId,
  subPropertySide,
}: {
  property: any;
  mode: 'focus' | 'form' | 'preview';
  glossaryId: string;
  type: GlossaryEntryType;
  subTypeId: string;
  groupId: string;
  propertyId: string;
  subPropertySide?: 'left' | 'right';
}) => {
  const [hoverString, setHoverString] = useState('');
  const [expand, setExpand] = useState(false);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { handleTransform, handleChange, isCompound } = useCompoundBridge({
    glossaryId,
    type,
    subTypeId,
    groupId,
    propertyId,
    property,
    subPropertySide,
  });

  const reorderList = (sourceIndex: number, destinationIndex: number) => {
    if (sourceIndex === destinationIndex) return;
    const order = Array.from(property.options);
    const [movedItem] = order.splice(sourceIndex, 1);
    order.splice(destinationIndex, 0, movedItem);
    handleChange(order, 'options');
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
        glossaryId={glossaryId}
        type={type}
        subTypeId={subTypeId}
        groupId={groupId}
        propertyId={propertyId}
        sx={{ gridColumn: 'span 3' }}
        isCompound={isCompound}
        side={subPropertySide}
      >
        {mode === 'focus' && (
          <FieldRow
            label="Range Type"
            mode={mode}
            sx={{ gridColumn: 'span 1' }}
          >
            <SubTypeSelectWrapper
              property={property}
              mode={mode}
              onChange={(e) => handleTransform(e.target.value, 'isNumber')}
              label="Range Type"
              keypath="isNumber"
              options={[
                { name: 'Number', value: true },
                { name: 'Text', value: false },
              ]}
            />
          </FieldRow>
        )}
      </FieldDefinition>
      {mode === 'form' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gridColumn: 'span 3',
            flexDirection: mode === 'form' ? 'row' : 'column',
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
              onChange={(e) => handleTransform(e.target.value, 'isNumber')}
              label="Range Type"
              keypath="isNumber"
              options={[
                { name: 'Number', value: true },
                { name: 'Text', value: false },
              ]}
            />
          </FieldRow>
          <FieldRow
            label="Minimum"
            mode={mode}
            sx={{ gridColumn: mode === 'form' ? 'span 1' : 'span 3' }}
          >
            <TextField
              fullWidth
              type="number"
              value={property.min}
              onChange={(e) => handleChange(e.target.value, 'min')}
              label="Minimum"
            />
          </FieldRow>
        </Box>
      )}
      {property.isNumber && (
        <>
          {mode === 'focus' && (
            <FieldRow
              label="Minimum"
              mode={mode}
              sx={{ gridColumn: 'span 3', mt: 1 }}
            >
              <TextField
                fullWidth
                type="number"
                value={property.min}
                onChange={(e) => handleChange(e.target.value, 'min')}
                label="Minimum"
              />
            </FieldRow>
          )}
          <Box
            sx={{
              mt: mode === 'form' ? 0 : 2,
              display: 'flex',
              gap: 2,
              gridColumn: 'span 3',
              flexDirection: mode === 'form' ? 'row' : 'column',
            }}
          >
            <FieldRow
              label="Maximum"
              mode={mode}
              sx={{ gridColumn: mode === 'form' ? 'span 1' : 'span 3' }}
            >
              <TextField
                fullWidth
                type="number"
                value={property.max}
                onChange={(e) => handleChange(e.target.value, 'max')}
                label="Maximum"
              />
            </FieldRow>
            <FieldRow
              label="Step"
              mode={mode}
              sx={{ gridColumn: mode === 'form' ? 'span 1' : 'span 3' }}
            >
              <TextField
                fullWidth
                type="number"
                value={property.step}
                onChange={(e) => handleChange(e.target.value, 'step')}
                label="Step"
              />
            </FieldRow>
          </Box>
        </>
      )}
      {!property.isNumber && (
        <FieldRow
          label="Steps"
          mode={mode}
          sx={{ gridColumn: 'span 3', mt: mode === 'focus' ? 1 : 0 }}
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
                const currentOptions = property?.options || [];
                if (currentOptions.includes(value)) return;
                handleChange([...currentOptions, value], 'options');
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
        </FieldRow>
      )}
      {!property.isNumber && (
        <FieldRow
          label="Defined Steps"
          mode={mode}
          alignItems="start"
          sx={{ gridColumn: 'span 3', mt: mode === 'focus' ? 1 : 0 }}
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
              {property.options && property.options.length > 3 && (
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
                {(property.options || []).map(
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
              {property?.options?.length !== 1
                ? `${property?.options?.length || 0} steps defined`
                : '1 step defined'}
            </Typography>
          </Box>
        </FieldRow>
      )}
      {mode === 'focus' && (
        <Box sx={{ gridColumn: 'span 3', mt: 2, width: '100%' }}>
          <SubTypePreviewWrapper>
            <SubTypeRangePreview
              property={property}
              isPreview={true}
              onChange={(val: any) => {}}
              source={
                generatePropertyValue(property, propertyId) as SubTypeRangeData
              }
            />
          </SubTypePreviewWrapper>
        </Box>
      )}
    </Box>
  );
};

export default SubTypeRange;
