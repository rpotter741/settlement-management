import React from 'react';

import { Button, TextField } from '@mui/material';

const TextAreaWithLabel = ({
  id,
  label,
  value,
  onChange,
  onRemove,
  removeText,
  ...props
}) => {
  return (
    <TextField
      id={id}
      value={value}
      onChange={onChange}
      multiline
      placeholder="" // Required for floating label effect
      {...props} // Spread additional props like `required`, `disabled`, etc.
    />
  );
};

export default TextAreaWithLabel;
