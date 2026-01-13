import { Box, Switch, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SubTypeCheckboxData } from '../types.js';

const SubTypeCheckBoxPreview = ({
  property,
  onChange,
  isPreview,
  source,
  keypath,
}: {
  property: any;
  onChange: (value: boolean, keypath: string) => void;
  isPreview: boolean;
  source: any;
  keypath: string;
}) => {
  const handleChange = useCallback(
    (value: boolean) => {
      onChange(value, `${keypath}.value`);
    },
    [isPreview, onChange]
  );

  return (
    <>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', display: 'inline', mr: 2 }}
      >
        {property.name || 'Checkbox'}
      </Typography>
      <Switch
        checked={source.value || property.shape.defaultChecked || false}
        onChange={(event) => handleChange(event.target.checked)}
      />
    </>
  );
};

export default SubTypeCheckBoxPreview;
