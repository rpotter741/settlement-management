import Editor from '@/components/shared/TipTap/Editor.js';
import { Box, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const SubTypeTextPreview = ({
  property,
  isPreview,
  onChange,
  source,
}: {
  property: any;
  isPreview: boolean;
  onChange: (value: any) => void;
  source: any;
}) => {
  const [previewValue, setPreviewValue] = useState(
    source.value || property.defaultValue || ''
  );

  useEffect(() => {
    setPreviewValue(property.defaultValue || '');
  }, [property.defaultValue]);

  const handleChange = (value: string) => {
    if (property.inputType === 'number') {
      const clampedValue = Math.min(
        Math.max(Number(value), property.minValue || -Infinity),
        property.maxValue || Infinity
      );
      isPreview ? setPreviewValue(clampedValue) : onChange(clampedValue);
      return;
    }
    if (property.textTransform === 'uppercase') {
      isPreview
        ? setPreviewValue(value.toUpperCase())
        : onChange(value.toUpperCase());
    }
    if (property.textTransform === 'lowercase') {
      isPreview
        ? setPreviewValue(value.toLowerCase())
        : onChange(value.toLowerCase());
    }
    if (property.textTransform === 'capitalize') {
      isPreview
        ? setPreviewValue(value.replace(/\b\w/g, (char) => char.toUpperCase()))
        : onChange(value.replace(/\b\w/g, (char) => char.toUpperCase()));
    }
    if (!property.textTransform || property.textTransform === 'none') {
      isPreview ? setPreviewValue(value) : onChange(value);
    }
  };

  if (property.inputType === 'richtext') {
    return <Editor />;
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 3 }}>
      <TextField
        label={property.name || 'Text'}
        value={previewValue}
        type={property.inputType === 'number' ? 'number' : 'text'}
        onChange={(e) => handleChange(e.target.value)}
        fullWidth
      />
      {property.valueLabel && <Typography>{property.valueLabel}</Typography>}
    </Box>
  );
};

export default SubTypeTextPreview;
