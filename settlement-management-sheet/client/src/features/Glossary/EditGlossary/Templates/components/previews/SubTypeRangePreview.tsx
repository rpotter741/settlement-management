import { Box, Slider, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SubTypeRangeData } from '../types.js';
import getPreviewSx from './previewSxMap.js';

const SubTypeRangePreview = ({
  property,
  onChange,
  source,
  keypath,
  isCompound,
  isAnchor,
}: {
  property: any;
  onChange: (value: any, keypath: string) => void;
  source: any;
  keypath: string;
  isCompound?: boolean;
  isAnchor?: boolean;
}) => {
  const [value, setValue] = useState<number>(
    source?.value || property.shape.min || 0
  );

  const handleChange = (value: number) => {
    setValue(value);
    onChange(value, `${keypath}.value`);
  };

  const marks = useMemo(() => {
    return (
      property?.shape.options?.map((step: string, index: number) => ({
        value: index,
        label: step,
      })) || []
    );
  }, [property?.shape.options]);

  const sx = getPreviewSx('range', property.shape.columns, isCompound ?? false);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        ...sx.wrapper,
      }}
    >
      {!isCompound && (
        <Box sx={{ ...sx?.textBox }}>
          <Typography
            sx={{
              width: '100%',
              ...sx.text,
              color: isAnchor ? 'info.main' : 'inherit',
            }}
          >
            {`${property.displayName || property.name}`}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          position: 'relative',
          ...sx.sliderBox,
        }}
      >
        <Slider
          value={Number(value)}
          valueLabelDisplay={property.shape.isNumber ? 'auto' : 'off'}
          onChange={(e, newValue) => {
            if (typeof newValue === 'number') {
              handleChange(newValue);
            }
          }}
          min={property.shape.isNumber ? Number(property.shape.min) : 0}
          max={
            property.shape.isNumber
              ? Number(property.shape.max)
              : (property?.shape.options?.length || 1) - 1
          }
          step={property.shape.step ?? 1}
          sx={{ maxWidth: 400 }}
          marks
        />
        {marks.length && !property.shape.isNumber ? (
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              position: 'absolute',
              bottom: -20,
              left: '50%',
              transform: 'translateX(-50%)',
              ...sx.sliderText,
            }}
          >
            {marks[value]?.label || ''}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default SubTypeRangePreview;
