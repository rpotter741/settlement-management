import React, { useState } from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';
import Switch from '../../../shared/Switch/Switch';
import Button from '../../../shared/Button/Button';
import Drawer from '../../../shared/Drawer/Drawer';
import {
  impactKeyOptions,
  impactAttributeOptions,
  impactCategoryOptions,
  impactTypeOptions,
} from '../../../../helpers/events/emptyEventObjects';

import NewCondition from './NewCondition';

const NewImpact = ({ impact, setImpact, index }) => {
  const getCategoryOptions = () => {
    switch (impact.type) {
      case 'category':
        return impactCategoryOptions;
      case 'settlement':
        return [
          { value: 'vault', label: 'Currency' },
          { value: 'health', label: 'Health' },
        ];
      case 'status':
        return [
          { value: 'fear', label: 'Fear' },
          { value: 'inspired', label: 'Inspired' },
          { value: 'riotous', label: 'Riotous' },
          { value: 'discontent', label: 'Discontent' },
          { value: 'big spenders', label: 'Big Spenders' },
        ];
      default:
        return [];
    }
  };

  const getAttributeOptions = () => {
    switch (impact.type) {
      case 'category':
        const key =
          impact.category.charAt(0).toUpperCase() + impact.category.slice(1);
        return impactAttributeOptions[0][key];
      case 'settlement':
        return [{ value: null, label: 'None' }];
      case 'status':
        return [{ value: null, label: 'None' }];
      default:
        return [];
    }
  };

  const getKeyOptions = () => {
    switch (impact.type) {
      case 'category':
        return [
          { value: 'current', label: 'Current' },
          { value: 'bonus', label: 'Bonus' },
        ];
      case 'settlement':
        return [
          { value: 'current', label: 'Current' },
          { value: 'bonus', label: 'Bonus' },
        ];
      case 'status':
        return [{ value: null, label: 'None' }];
      default:
        return [];
    }
  };

  const handleSwitch = () => {
    setImpact({ ...impact, immutable: !impact.immutable });
  };

  return (
    <div className="flex flex-col items-center border-b pb-4 mb-4">
      <FloatingSelect
        label="Type"
        options={impactTypeOptions}
        value={impact.type}
        onChange={(e) => setImpact({ ...impact, type: e.target.value })}
      />
      <FloatingSelect
        label="Category"
        options={getCategoryOptions()}
        value={impact.category}
        onChange={(e) => setImpact({ ...impact, category: e.target.value })}
      />
      <FloatingSelect
        label="Attribute"
        options={getAttributeOptions()}
        value={impact.attribute}
        onChange={(e) => setImpact({ ...impact, attribute: e.target.value })}
      />
      <FloatingSelect
        label="Key"
        options={getKeyOptions()}
        value={impact.key}
        onChange={(e) => setImpact({ ...impact, key: e.target.value })}
      />
      <InputWithLabel
        label="Base Amount"
        type="number"
        value={impact.baseAmount}
        onChange={(e) => setImpact({ ...impact, baseAmount: e.target.value })}
      />
      <Switch
        label="Immutable"
        checked={impact.immutable}
        onChange={handleSwitch}
      />
    </div>
  );
};

export default NewImpact;
