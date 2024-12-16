import React, { useState } from 'react';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';
import Drawer from '../../../shared/Drawer/Drawer';
import Button from '../../../shared/Button/Button';

import { emptyThreshold } from '../../../../helpers/events/emptyEventObjects';

import NewThreshold from './NewThreshold';
import ThresholdsDetails from '../../../../helpers/events/ThresholdsDetails';

const NewCondition = ({ condition, setCondition }) => {
  return (
    <div>
      <FloatingSelect
        label="Recommendation Frequency"
        options={[
          { value: 'veryRare', label: 'Very Rarely (1% - 5 %)' },
          { value: 'rare', label: 'Rarely (6% - 15%' },
          { value: 'occasional', label: 'Occasionally (16% - 30%)' },
          { value: 'frequent', label: 'Frequently (31% - 60%)' },
          { value: 'veryFrequent', label: 'Very Frequently (61% - 90%)' },
        ]}
        value={condition.frequency}
        onChange={(e) =>
          setCondition({ ...condition, frequency: e.target.value })
        }
      />
      <NewThreshold
        key={Math.random()}
        thresholds={condition.thresholds}
        setThreshold={(newThreshold, index) => {
          const newThresholds = [...condition.thresholds];
          newThresholds[index] = newThreshold;
          setCondition({ ...condition, thresholds: newThresholds });
        }}
        removeThreshold={(index) => {
          const newThresholds = [...condition.thresholds];
          newThresholds.splice(index, 1);
          setCondition({ ...condition, thresholds: newThresholds });
        }}
      />
      <Button
        onClick={() =>
          setCondition({
            ...condition,
            thresholds: [...condition.thresholds, { ...emptyThreshold }],
          })
        }
      >
        Add Threshold
      </Button>
    </div>
  );
};

export default NewCondition;
