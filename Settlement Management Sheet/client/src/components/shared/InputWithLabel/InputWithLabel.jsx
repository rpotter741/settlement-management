import React from 'react';
import './InputWithLabel.css'; // Import the custom CSS

const InputWithLabel = ({
  id,
  label,
  value,
  onChange,
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
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default InputWithLabel;
