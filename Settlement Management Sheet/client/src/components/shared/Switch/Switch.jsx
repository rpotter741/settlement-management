import React from 'react';
import './Switch.css';

const Switch = ({ checked, onChange, label }) => {
  return (
    <label className="switch">
      <span className="switch-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  );
};

export default Switch;
