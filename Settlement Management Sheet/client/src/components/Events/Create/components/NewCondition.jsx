import React, { useState } from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import TextAreaWithLabel from '../../../shared/TextAreaWithLabel/TextAreaWithLabel';
import Button from '../../../shared/Button/Button';

import NewThreshold from './NewThreshold';

const NewCondition = ({ condition, setCondition }) => {
  return (
    <div className="flex flex-col items-center w-full border-b p-4 mb-4">
      <TextAreaWithLabel
        label="Tags"
        value={condition.tags}
        onChange={(e) => setCondition({ ...condition, tags: e.target.value })}
      />
      <InputWithLabel
        label="Base Chance"
        type="number"
        value={condition.chance}
        onChange={(e) => setCondition({ ...condition, chance: e.target.value })}
      />
      <h4 className="text-xl font-bold">Thresholds</h4>
      {condition.thresholds.map((threshold, index) => (
        <NewThreshold
          key={index}
          threshold={threshold}
          setThreshold={(newThreshold) => {
            const newThresholds = [...condition.thresholds];
            newThresholds[index] = newThreshold;
            setCondition({ ...condition, thresholds: newThresholds });
          }}
          index={index}
        />
      ))}
    </div>
  );
};

export default NewCondition;
