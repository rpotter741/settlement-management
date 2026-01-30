import Editor from '@/components/shared/TipTap/Editor.js';
import { Box, Divider, TextField, Typography } from '@mui/material';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import getPreviewSx from './previewSxMap.js';

const SubTypeTextPreview = ({
  property,
  onChange,
  source,
  keypath,
  isCompound,
  columns = 4,
}: {
  property: any;
  onChange: (value: any, keypath: string) => void;
  source: any;
  keypath: string;
  isCompound?: boolean;
  columns?: number;
}) => {
  const [previewValue, setPreviewValue] = useState(
    source?.value ?? property.shape.defaultValue ?? ''
  );

  useEffect(() => {
    setPreviewValue(property.shape.defaultValue || '');
  }, [property.shape.defaultValue]);

  const handleChange = (value: string) => {
    if (property.inputType === 'number') {
      const clampedValue = Math.min(
        Math.max(Number(value), property.shape.minValue || -Infinity),
        property.shape.maxValue || Infinity
      );
      return onChange(clampedValue, `${keypath}.value`);
    }
    if (property.shape.textTransform === 'uppercase') {
      onChange(value.toUpperCase(), `${keypath}.value`);
    }
    if (property.shape.textTransform === 'lowercase') {
      onChange(value.toLowerCase(), `${keypath}.value`);
    }
    if (property.shape.textTransform === 'capitalize') {
      onChange(
        value.replace(/\b\w/g, (char) => char.toUpperCase()),
        `${keypath}.value`
      );
    }
    if (
      !property.shape.textTransform ||
      property.shape.textTransform === 'none'
    ) {
      onChange(value, `${keypath}.value`);
    }
  };

  if (property.shape.inputType === 'richtext') {
    return (
      <>
        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
          {property.name}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Editor />
      </>
    );
  }

  const sx = getPreviewSx('text', columns as 4, isCompound ?? false);

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
      {sx.useSideLabel ? (
        <Typography
          sx={{
            width: '60%',
            textAlign: 'start',
            fontSize: '1.25rem',
          }}
        >
          {property.name}
        </Typography>
      ) : null}
      <TextField
        label={!sx.useSideLabel ? property.name || 'Text' : undefined}
        value={source?.value || previewValue}
        type={property.shape.inputType === 'number' ? 'number' : 'text'}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
        slotProps={{
          input: {
            endAdornment:
              property.shape.inputType === 'number' ? (
                <Typography sx={{ width: 'fit-content', textWrap: 'nowrap' }}>
                  {property.shape.valueLabel}
                </Typography>
              ) : null,
          },
        }}
      />
    </Box>
  );
};

export default SubTypeTextPreview;
