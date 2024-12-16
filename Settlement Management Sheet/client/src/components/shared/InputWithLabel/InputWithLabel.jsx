import React from 'react';
import './InputWithLabel.css'; // Import the custom CSS

import Button from '../Button/Button'; // Import the Button component

const InputWithLabel = ({
  id,
  label,
  value,
  onChange,
  onRemove,
  removeText,
  hideLabel = false,
  type = 'text',
  ...props
}) => {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" " // Required for floating label effect
        {...props} // Spread additional props like `required`, `disabled`, etc.
      />
      {!hideLabel && (
        <label className="label" htmlFor={id}>
          {label}
        </label>
      )}
      {onRemove && label !== 'Default' && (
        <Button variant="warning" onClick={onRemove}>
          {removeText || 'Remove'}
        </Button>
      )}
    </div>
  );
};

export default InputWithLabel;
