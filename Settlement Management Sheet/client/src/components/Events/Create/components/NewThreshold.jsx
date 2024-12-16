import React, { useState } from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import TextAreaWithLabel from '../../../shared/TextAreaWithLabel/TextAreaWithLabel';
import Button from '../../../shared/Button/Button';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';

import {
  impactCategoryOptions,
  impactAttributeOptions,
  thresholdOperatorOptions,
} from '../../../../helpers/events/emptyEventObjects';

const NewThreshold = ({ threshold, setThreshold, index }) => {
  //
  return (
    <div className="flex flex-col items-center w-full">
      <FloatingSelect
        label="Category"
        options={impactCategoryOptions}
        value={threshold.category}
        onChange={(e) =>
          setThreshold({ ...threshold, category: e.target.value })
        }
      />
      <FloatingSelect
        label="Attribute"
        options={impactAttributeOptions}
        value={threshold.attribute}
        onChange={(e) =>
          setThreshold({ ...threshold, attribute: e.target.value })
        }
      />
      <FloatingSelect
        label="Operator"
        options={thresholdOperatorOptions}
        value={threshold.operator}
        onChange={(e) =>
          setThreshold({ ...threshold, operator: e.target.value })
        }
      />
      <InputWithLabel
        label="Value"
        type="number"
        value={threshold.value}
        onChange={(e) => setThreshold({ ...threshold, value: e.target.value })}
      />
    </div>
  );
};

export default NewThreshold;
