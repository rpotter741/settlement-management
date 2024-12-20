import React, { useState } from 'react';
import './FloatingSelect.css';

import Button from '../Button/Button';
const FloatingSelect = ({
  label,
  options,
  value,
  onChange,
  onRemove,
  maxWidth,
  hideDefault,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      className={`floating-select ${isFocused || value ? 'active' : ''}`}
      style={maxWidth && { maxWidth }}
    >
      <label className="floating-label">{label}</label>
      <select
        className="floating-dropdown"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {!hideDefault ? (
          <option value="" disabled hidden>
            {label}
          </option>
        ) : (
          <option value="">Select an option</option>
        )}
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {onRemove && (
        <Button variant="warning" onClick={onRemove}>
          Remove
        </Button>
      )}
    </div>
  );
};

export default FloatingSelect;
