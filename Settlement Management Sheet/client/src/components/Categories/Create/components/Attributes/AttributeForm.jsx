import React, { useState } from 'react';
import InputWithLabel from '../../../../shared/InputWithLabel/InputWithLabel';
import FloatingSelect from '../../../../shared/FloatingSelect/FloatingSelect';
import Button from '../../../../shared/Button/Button';
import './AttributeForm.css';

const AttributeForm = ({ attr, index, onChange, onRemove, level }) => {
  const [typeSelect, setTypeSelect] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSPType, setCustomSPType] = useState('');
  const [customSPValue, setCustomSPValue] = useState(0);

  const handleInputChange = (keyPath, value) => {
    const keys = keyPath.split('.');
    let updatedAttr = { ...attr };

    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = value;
      }
      return acc[key];
    }, updatedAttr);

    onChange(updatedAttr, index);
  };

  const handleRemoveSettlementType = (type) => {
    const updatedSPCosts = { ...attr.settlementPointCost };
    delete updatedSPCosts[type];
    setTypeSelect('Select an option');
    handleInputChange('settlementPointCost', updatedSPCosts);
  };

  const getSettlementTypeOptions = () => {
    const options = [
      { value: 'Survivalist', label: 'Survivalist' },
      { value: 'Mercantile', label: 'Mercantile' },
      { value: 'Fortified', label: 'Fortified' },
      { value: 'Custom', label: 'Custom' }, // Add custom as an option
    ];
    return options.filter(
      (option) => !Object.keys(attr.settlementPointCost).includes(option.value)
    );
  };

  const addSettlementPointCost = (type) => {
    if (!type || type.trim() === '') return; // Ensure valid type

    // Check if the type already exists in settlementPointCost
    if (attr.settlementPointCost.hasOwnProperty(type)) {
      alert(`Settlement Point Cost for "${type}" already exists.`);
      return;
    }

    // const existingType = settlementTypes.find((t) => t.name === type);
    // if (existingType) {
    //   alert(`Settlement Type "${type}" already exists!`);
    //   return;
    // }

    // Add the new type with a default value of 0
    const updatedSPCosts = { ...attr.settlementPointCost, [type]: 0 };

    // Update the state with the new settlementPointCost
    handleInputChange('settlementPointCost', updatedSPCosts);

    // Optionally, add type to the database
    // axios
    //   .post('/api/settlement-types', { name: type, status: 'pending' })
    //   .catch((err) => {
    //     console.error('Error adding settlement type:', err);
    //   });
  };

  const handleCustomModalSubmit = () => {
    if (customSPType.trim()) {
      addSettlementPointCost(customSPType, customSPValue);
    }
    setTypeSelect('Select an option');
    setShowCustomModal(false);
    setCustomSPType('');
    setCustomSPValue(0);
  };

  return (
    <div>
      <InputWithLabel
        id={`attribute-type${index}`}
        label="Name"
        value={attr.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        type="text"
        required={true}
      />
      <div>
        <InputWithLabel
          id={`attribute-currency-cost${index}`}
          label="Currency Cost Per Level"
          value={attr.currencyCostPerLevel}
          onChange={(e) =>
            handleInputChange('currencyCostPerLevel', Number(e.target.value))
          }
          type="number"
          required={true}
        />
      </div>
      <h4 className="my-4 text-xl font-bold ml-4">Values</h4>
      {['current', 'maxPerLevel', 'max', 'bonus'].map((key) => (
        <div key={key}>
          <InputWithLabel
            id={`attribute-${key}${index}`}
            label={
              key === 'current'
                ? 'Starting Value'
                : key === 'maxPerLevel'
                  ? 'Max Per Level'
                  : key.charAt(0).toUpperCase() + key.slice(1)
            }
            value={
              key === 'max'
                ? attr.values.maxPerLevel * level + attr.values.bonus
                : attr.values[key]
            }
            onChange={(e) =>
              handleInputChange(`values.${key}`, Number(e.target.value))
            }
            type="number"
            disabled={key === 'max'}
            required={key !== 'max'}
          />
        </div>
      ))}
      <h4 className="my-4 text-xl font-bold ml-4">Settlement Point Costs</h4>
      {Object.keys(attr.settlementPointCost).map((type) => (
        <div key={type}>
          <InputWithLabel
            id={`attribute-${type}${index}`}
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            value={attr.settlementPointCost[type]}
            onChange={(e) =>
              handleInputChange(
                `settlementPointCost.${type}`,
                Number(e.target.value)
              )
            }
            onRemove={() => handleRemoveSettlementType(type)}
            type="number"
            min={1}
          />
        </div>
      ))}

      <div>
        <FloatingSelect
          label="Settlement Types"
          options={getSettlementTypeOptions()}
          value={typeSelect}
          onChange={(e) => {
            setTypeSelect(e.target.value);
            if (e.target.value === 'Custom') {
              setShowCustomModal(true); // Show modal when "Custom" is selected
            } else {
              addSettlementPointCost(e.target.value);
            }
          }}
          hideDefault={true}
        />
      </div>

      {/* Modal for Custom Settlement Type */}
      {showCustomModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Add Custom Settlement Type</h4>
            <InputWithLabel
              id="custom-sp-type"
              label="Custom Type Name"
              value={customSPType}
              onChange={(e) => setCustomSPType(e.target.value)}
              type="text"
              min={1}
            />
            <InputWithLabel
              id="custom-sp-value"
              label="Default Value"
              value={customSPValue}
              onChange={(e) => setCustomSPValue(Number(e.target.value))}
              type="number"
              min={1}
            />
            <button onClick={handleCustomModalSubmit}>Add</button>
            <button onClick={() => setShowCustomModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeForm;
