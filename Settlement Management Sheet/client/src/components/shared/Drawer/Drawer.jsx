import React, { useState } from 'react';
import './Drawer.css';

const Drawer = ({
  children,
  header,
  onRemove,
  type,
  index,
  headerBackground,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const headerStyle = {
    backgroundColor: headerBackground || '#242424',
  };

  return (
    <div className={`drawer ${isOpen ? 'open' : 'closed'}`}>
      <div className="drawer-header" style={headerStyle}>
        {onRemove && (
          <button onClick={() => onRemove(type, index)}>Remove</button>
        )}
        <h2>{header}</h2>
        <button onClick={toggleDrawer}>{isOpen ? 'Close' : 'Open'}</button>
      </div>
      <div className="drawer-content">{children}</div>
    </div>
  );
};

export default Drawer;
