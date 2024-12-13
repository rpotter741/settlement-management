import React from 'react';
import InputWithLabel from '../../../../shared/InputWithLabel/InputWithLabel';
import FloatingSelect from '../../../../shared/FloatingSelect/FloatingSelect';

const Dependencies = ({
  dependencies,
  categories,
  categoryName,
  onChange,
  onAddItem,
  onRemoveItem,
}) => {
  const handleConditionChange = (index, threshold, value) => {
    const updatedCondition = {
      rating: threshold.rating,
      modifier: Number(value),
    };

    const existingConditions = dependencies[index]?.conditions || [];
    const updatedConditions = existingConditions.some(
      (cond) => cond.rating === threshold.rating
    )
      ? existingConditions.map((cond) =>
          cond.rating === threshold.rating ? updatedCondition : cond
        )
      : [...existingConditions, updatedCondition];

    onChange(`dependencies.${index}.conditions`, updatedConditions);
  };

  return (
    <div>
      <h2>Dependencies</h2>
      {dependencies.map((dep, index) => (
        <div key={index} className="dependency-item">
          {/* Dependency Target */}
          <div className="dependency-header">
            <FloatingSelect
              label="Category"
              options={categories
                .filter((cat) => cat.name !== categoryName)
                .map((cat) => ({ value: cat.name, label: cat.name }))}
              value={dep.target}
              onChange={(e) =>
                onChange(`dependencies.${index}.target`, e.target.value)
              }
            />
            <button
              className="create-category-button remove-button"
              onClick={() => onRemoveItem('dependencies', index)}
            >
              Remove Dependency
            </button>
          </div>

          {/* Dependency Conditions */}
          {dep.target && (
            <div className="dependency-conditions">
              <h4>Conditions for {dep.target}</h4>
              {categories
                .find((cat) => cat.name === dep.target)
                ?.thresholds.map((threshold, condIndex) => (
                  <div key={condIndex} className="condition-item">
                    <InputWithLabel
                      label={`${threshold.rating}`}
                      type="number"
                      value={
                        dep.conditions?.find(
                          (cond) => cond.rating === threshold.rating
                        )?.modifier || 0
                      }
                      onChange={(e) =>
                        handleConditionChange(index, threshold, e.target.value)
                      }
                      step={0.1}
                      min={0}
                      max={5}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dependencies;
