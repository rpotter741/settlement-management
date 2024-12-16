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
  const handleImpactRemove = (index) => {
    const newImpacts = [...impact.impacts];
    newImpacts.filter((_, i) => i !== index);
    setImpact({ ...impact, impacts: newImpacts });
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
        options={impactCategoryOptions}
        value={impact.category}
        onChange={(e) => setImpact({ ...impact, category: e.target.value })}
      />
      <FloatingSelect
        label="Attribute"
        options={impactAttributeOptions}
        value={impact.attribute}
        onChange={(e) => setImpact({ ...impact, attribute: e.target.value })}
      />
      <FloatingSelect
        label="Key"
        options={impactKeyOptions}
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
        onChange={(e) => setImpact({ ...impact, immutable: e.target.checked })}
      />
      <h5 className="text-lg font-bold">Conditions</h5>
      {impact.conditions &&
        impact.conditions.map((condition, index) => (
          <Drawer
            key={index}
            header={`Condition ${index + 1}`}
            onRemove={() => {
              handleImpactRemove(index);
            }}
            type="condition"
          >
            <NewCondition
              key={index}
              condition={condition}
              setCondition={(newCondition) => {
                const newConditions = [...impact.conditions];
                newConditions[index] = newCondition;
                setImpact({ ...impact, conditions: newConditions });
              }}
            />
          </Drawer>
        ))}
    </div>
  );
};

export default NewImpact;
