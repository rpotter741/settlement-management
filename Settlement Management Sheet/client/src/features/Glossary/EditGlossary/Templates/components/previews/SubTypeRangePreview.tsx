import { Box, Slider, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { SubTypeRangeData } from '../types.js';

const SubTypeRangePreview = ({
  property,
  onChange,
  isPreview,
  source,
}: {
  property: any;
  onChange: (value: unknown) => void;
  isPreview: boolean;
  source: SubTypeRangeData;
}) => {
  const [value, setValue] = useState<number>(source.value || property.min || 0);

  const handleChange = (value: number) => {
    if (!isPreview) {
      setValue(value);
      onChange(value);
    } else {
      setValue(value);
    }
  };

  const marks = useMemo(() => {
    return (
      property?.options?.map((step: string, index: number) => ({
        value: index,
        label: step,
      })) || []
    );
  }, [property?.options]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
      }}
    >
      <Slider
        value={value}
        valueLabelDisplay={property.isNumber ? 'auto' : 'off'}
        onChange={(e, newValue) => {
          if (typeof newValue === 'number') {
            handleChange(newValue);
          }
        }}
        min={property.isNumber ? property.min : 0}
        max={
          property.isNumber
            ? property.max
            : (property?.options?.length || 1) - 1
        }
        step={property.step ?? 1}
        sx={{ maxWidth: 400 }}
        marks
      />
      {marks.length && !property.isNumber ? (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            position: 'absolute',
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {marks[value]?.label || ''}
        </Typography>
      ) : null}
    </Box>
  );
};

export default SubTypeRangePreview;
