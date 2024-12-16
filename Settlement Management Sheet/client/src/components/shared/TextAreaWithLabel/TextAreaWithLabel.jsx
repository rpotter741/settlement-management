import React from 'react';
import './TextAreaWithLabel.css';

import Button from '../Button/Button';

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
    <div className="input-wrapper">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" " // Required for floating label effect
        {...props} // Spread additional props like `required`, `disabled`, etc.
      />
      <label className="talabel" htmlFor={id}>
        {label}
      </label>
      {onRemove && label !== 'Default' && (
        <Button variant="warning" onClick={onRemove}>
          {removeText || 'Remove'}
        </Button>
      )}
    </div>
  );
};

export default TextAreaWithLabel;
