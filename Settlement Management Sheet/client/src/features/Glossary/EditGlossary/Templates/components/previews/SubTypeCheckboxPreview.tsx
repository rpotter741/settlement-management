import { Box, Switch, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { SubTypeCheckboxData } from '../types.js';

const SubTypeCheckBoxPreview = ({
  property,
  onChange,
  isPreview,
  source,
}: {
  property: any;
  onChange: (value: boolean) => void;
  isPreview: boolean;
  source: SubTypeCheckboxData;
}) => {
  const [checked, setChecked] = useState(
    source.value || property.defaultChecked || false
  );

  const handleChange = useCallback(
    (value: boolean) => {
      if (!isPreview) {
        setChecked(value);
        onChange(value);
      } else {
        setChecked(value);
      }
    },
    [isPreview, onChange]
  );

  useEffect(() => {
    setChecked(
      isPreview ? property.defaultChecked || false : source.value || false
    );
  }, [isPreview, property.defaultChecked, source.value]);

  return (
    <>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', display: 'inline', mr: 2 }}
      >
        {property.name || 'Checkbox'}
      </Typography>
      <Switch
        checked={checked}
        onChange={(event) => handleChange(event.target.checked)}
      />
    </>
  );
};

export default SubTypeCheckBoxPreview;
