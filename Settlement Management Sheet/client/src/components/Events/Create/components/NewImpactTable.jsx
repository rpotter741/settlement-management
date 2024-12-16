import React from 'react';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import Switch from '../../../shared/Switch/Switch';
import Button from '../../../shared/Button/Button';

import {
  impactKeyOptions,
  impactAttributeOptions,
  impactCategoryOptions,
  impactTypeOptions,
} from '../../../../helpers/events/emptyEventObjects';

const NewImpactTable = ({ impacts, setImpacts }) => {
  const handleImpactChange = (index, field, value) => {
    const updatedImpacts = impacts.map((impact, i) =>
      i === index ? { ...impact, [field]: value } : impact
    );
    setImpacts(updatedImpacts);
  };

  const handleSwitchChange = (index) => {
    const updatedImpacts = impacts.map((impact, i) =>
      i === index ? { ...impact, immutable: !impact.immutable } : impact
    );
    setImpacts(updatedImpacts);
  };

  const handleRemoveImpact = (index) => {
    const updatedImpacts = impacts.filter((_, i) => i !== index);
    setImpacts(updatedImpacts);
  };

  return (
    <div className="overflow-x-auto w-full min-w-[800px]">
      <table className="table-auto w-full border-collapse border border-minor-two min-w-full">
        <thead>
          <tr className="bg-background text-primary">
            <th className="border border-minor-two px-4 py-2">Type</th>
            <th className="border border-minor-two px-4 py-2">Category</th>
            <th className="border border-minor-two px-4 py-2">Attribute</th>
            <th className="border border-minor-two px-4 py-2">Key</th>
            <th className="border border-minor-two px-4 py-2">Base Amount</th>
            <th className="border border-minor-two px-4 py-2">Immutable</th>
            <th className="border border-minor-two px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {impacts.map((impact, index) => (
            <tr key={index} className="bg-secondary text-primary">
              <td className="border border-minor-two px-2">
                <FloatingSelect
                  options={impactTypeOptions}
                  value={impact.type}
                  onChange={(e) =>
                    handleImpactChange(index, 'type', e.target.value)
                  }
                  hideLabel={true}
                />
              </td>
              <td className="border border-minor-two px-2">
                <FloatingSelect
                  options={
                    impact.type === 'category'
                      ? impactCategoryOptions
                      : impact.type === 'settlement'
                        ? [
                            { value: 'vault', label: 'Currency' },
                            { value: 'health', label: 'Health' },
                          ]
                        : [
                            { value: 'fear', label: 'Fear' },
                            { value: 'inspired', label: 'Inspired' },
                          ]
                  }
                  value={impact.category}
                  onChange={(e) =>
                    handleImpactChange(index, 'category', e.target.value)
                  }
                  hideLabel={true}
                />
              </td>
              <td className="border border-minor-two px-2">
                <FloatingSelect
                  options={
                    impact.type === 'category'
                      ? impactAttributeOptions[0][
                          impact.category.charAt(0).toUpperCase() +
                            impact.category.slice(1)
                        ]
                      : [{ value: null, label: 'None' }]
                  }
                  value={impact.attribute}
                  onChange={(e) =>
                    handleImpactChange(index, 'attribute', e.target.value)
                  }
                  hideLabel={true}
                />
              </td>
              <td className="border border-minor-two px-2">
                <FloatingSelect
                  options={
                    impact.category !== 'currency'
                      ? impactKeyOptions
                      : impactKeyOptions.filter(
                          (option) => option.value !== 'bonus'
                        )
                  }
                  value={impact.key}
                  onChange={(e) =>
                    handleImpactChange(index, 'key', e.target.value)
                  }
                  hideLabel={true}
                />
              </td>
              <td className="border border-minor-two px-2">
                <InputWithLabel
                  value={impact.baseAmount}
                  type="number"
                  onChange={(e) =>
                    handleImpactChange(index, 'baseAmount', e.target.value)
                  }
                  hideLabel={true}
                />
              </td>
              <td className="border border-minor-two px-2 text-center">
                <Switch
                  checked={impact.immutable}
                  onChange={() => handleSwitchChange(index)}
                />
              </td>
              <td className="border border-minor-two px-2 text-center">
                <Button
                  variant="danger"
                  onClick={() => handleRemoveImpact(index)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewImpactTable;
