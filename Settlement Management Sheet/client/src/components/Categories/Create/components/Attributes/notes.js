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
</div>;
