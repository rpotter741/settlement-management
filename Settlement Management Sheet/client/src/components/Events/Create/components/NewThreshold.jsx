import React from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';
import './NewThreshold.css';
import Button from '../../../shared/Button/Button';

import {
  impactCategoryOptions,
  impactAttributeOptions,
  thresholdOperatorOptions,
} from '../../../../helpers/events/emptyEventObjects';

const NewThreshold = ({ thresholds, setThreshold, removeThreshold }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="table">
        <thead>
          <tr className="bg-accent-two text-primary">
            <th className="border border-minor-two px-4 py-2">Remove</th>
            <th className="border border-minor-two px-4 py-2">Category</th>
            <th className="border border-minor-two px-4 py-2">Attribute</th>
            <th className="border border-minor-two px-4 py-2">Operator</th>
            <th className="border border-minor-two px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          {thresholds.map((threshold, index) => (
            <tr key={index}>
              <td className="border border-minor-two px-4 py-2 button-cell">
                <Button
                  variant="warning"
                  onClick={() => removeThreshold(index)}
                  className="btn bg-accent text-background px-2 py-1 rounded"
                >
                  X
                </Button>
              </td>
              <td className="border border-minor-two px-4 py-2">
                <FloatingSelect
                  label="Category"
                  options={impactCategoryOptions}
                  value={threshold.category}
                  onChange={(e) =>
                    setThreshold(
                      { ...threshold, category: e.target.value },
                      index
                    )
                  }
                />
              </td>
              <td className="border border-minor-two px-4 py-2">
                <FloatingSelect
                  label="Attribute"
                  options={
                    impactAttributeOptions[0][
                      threshold.category.charAt(0).toUpperCase() +
                        threshold.category.slice(1)
                    ]
                  }
                  value={threshold.attribute}
                  onChange={(e) =>
                    setThreshold(
                      { ...threshold, attribute: e.target.value },
                      index
                    )
                  }
                />
              </td>
              <td className="border border-minor-two px-4 py-2">
                <FloatingSelect
                  label="Operator"
                  options={thresholdOperatorOptions}
                  value={threshold.operator}
                  onChange={(e) =>
                    setThreshold(
                      { ...threshold, operator: e.target.value },
                      index
                    )
                  }
                />
              </td>
              <td className="border border-minor-two px-4 py-2">
                <InputWithLabel
                  label="Value"
                  type="number"
                  value={threshold.value}
                  onChange={(e) =>
                    setThreshold({ ...threshold, value: e.target.value }, index)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewThreshold;
