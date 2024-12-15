import React, { useState } from 'react';
import './Drawer.css';

import Button from '../Button/Button';

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
          <Button variant="warning" onClick={() => onRemove(type, index)}>
            Remove
          </Button>
        )}
        <h2>{header}</h2>
        <Button variant="primary" onClick={toggleDrawer}>
          {isOpen ? 'Close' : 'Open'}
        </Button>
      </div>
      <div className="drawer-content">{children}</div>
    </div>
  );
};

export default Drawer;
