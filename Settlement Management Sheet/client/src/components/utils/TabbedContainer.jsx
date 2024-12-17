import React, { useState } from 'react';

const TabbedContainer = ({
  tabs,
  children,
  direction = 'horizontal',
  onAdd,
  onRemove,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const isHorizontal = direction === 'horizontal';

  const handleTabClick = (tab, index) => {
    if (tab === '+') {
      onAdd();
    } else {
      setActiveTab(index);
    }
  };

  return (
    <div
      className={`flex ${
        isHorizontal ? 'flex-col' : 'flex-row'
      } w-full max-h-[85vh] overflow-y-scroll`}
    >
      {/* Tabs */}
      <div
        className={`${
          isHorizontal ? 'flex-row' : 'flex-col'
        } flex py-2 pb-0 space-x-2`}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`relative flex items-center ${
              isHorizontal ? 'flex-row' : 'flex-col'
            }`}
          >
            <button
              onClick={() => handleTabClick(tab, index)}
              className={`p-2 text-center flex-grow ${
                activeTab === index
                  ? 'font-bold text-primary border-primary border-b-0 rounded-none bg-secondary'
                  : 'text-gray-500 border-secondary text-secondary hover:text-primary hover:border-primary rounded-none'
              } ${!isHorizontal ? 'border-l-4' : ''}`}
            >
              {tab}
            </button>
            {onRemove && tabs.length > 2 && tab !== '+' && (
              <button
                onClick={() => onRemove('', index)}
                className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 bg-red-500 text-white text-sm w-6 h-6 flex items-center justify-center rounded-full"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow p-4 h-full overflow-y-scroll bg-gray-100 border border-secondary">
        {Array.isArray(children) ? children[activeTab] : children}
      </div>
    </div>
  );
};

export default TabbedContainer;
