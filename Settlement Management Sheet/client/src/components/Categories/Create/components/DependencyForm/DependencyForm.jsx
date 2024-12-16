import React from 'react';
import InputWithLabel from '../../../../shared/InputWithLabel/InputWithLabel';
import FloatingSelect from '../../../../shared/FloatingSelect/FloatingSelect';

const DependencyForm = ({
  dependency,
  dependencies,
  categories,
  categoryName,
  onChange,
  onRemove,
}) => {
  const handleConditionChange = (threshold, value) => {
    const updatedCondition = {
      rating: threshold.rating,
      modifier: Number(value),
    };

    const existingConditions = dependency.conditions || [];
    const updatedConditions = existingConditions.some(
      (cond) => cond.rating === threshold.rating
    )
      ? existingConditions.map((cond) =>
          cond.rating === threshold.rating ? updatedCondition : cond
        )
      : [...existingConditions, updatedCondition];

    onChange('conditions', updatedConditions);
  };

  const getOptions = (currentTarget) => {
    return categories
      .filter((cat) => cat.name !== categoryName) // Exclude the current category
      .filter(
        (cat) =>
          !dependencies.some(
            (dep) => dep.target === cat.name && dep.target !== currentTarget
          ) // Exclude already selected dependencies unless it's the current target
      )
      .map((cat) => ({ value: cat.name, label: cat.name }));
  };

  return (
    <div className="dependency-item">
      {/* Dependency Target */}
      <div className="dependency-header">
        <FloatingSelect
          label="Category"
          options={getOptions(dependency.target)}
          value={dependency.target}
          onChange={(e) => onChange('target', e.target.value)}
          onRemove={onRemove}
        />
      </div>

      {/* Dependency Conditions */}
      {dependency.target && (
        <div className="dependency-conditions">
          <h4>Modifiers for {dependency.target} State:</h4>
          {categories
            .find((cat) => cat.name === dependency.target)
            ?.thresholds.map((threshold, condIndex) => (
              <div key={condIndex} className="condition-item">
                <InputWithLabel
                  label={`${threshold.rating}`}
                  type="number"
                  value={
                    dependency.conditions?.find(
                      (cond) => cond.rating === threshold.rating
                    )?.modifier || 0
                  }
                  onChange={(e) =>
                    handleConditionChange(threshold, e.target.value)
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
  );
};

export default DependencyForm;
