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
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`drawer ${
        isOpen ? 'open' : 'closed'
      } border border-minor-two rounded-lg shadow-md mb-4 p-4 w-full`}
    >
      <div
        className={`drawer-header bg-${headerBackground || 'background'}
        flex items-center justify-between sticky top-0 z-5 p-4 border-b border-minor w-full`}
      >
        {onRemove && (
          <Button
            variant="warning"
            onClick={() => onRemove(type, index)}
            className="bg-accent text-background px-2 py-1 rounded"
          >
            Remove
          </Button>
        )}
        <h2 className="text-primary font-bold">{header}</h2>
        <Button
          variant="primary"
          onClick={toggleDrawer}
          className="bg-secondary text-background px-2 py-1 rounded"
        >
          {isOpen ? 'Close' : 'Open'}
        </Button>
      </div>
      <div
        className={`drawer-content transition-all duration-300 ${
          isOpen
            ? 'max-h-[2000px] transform scale-y-100'
            : 'max-h-0 transform scale-y-0'
        } overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
};

export default Drawer;
