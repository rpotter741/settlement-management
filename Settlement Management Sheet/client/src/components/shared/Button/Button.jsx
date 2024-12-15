import React from 'react';
import './Button.css';

const Button = ({
  type = 'button',
  onClick,
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${variant} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
