import React from 'react';
import InputWithLabel from '../../../../shared/InputWithLabel/InputWithLabel';

import ValidatedInput from '../../../../utils/ValidatedTextArea/ValidatedInput';
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button,
  FormControl,
  InputLabel,
} from '@mui/material';
import TitledCollapse from '../../../../utils/TitledCollapse/TitledCollapse';

const DependencyForm = ({
  dependency,
  dependencies,
  categories,
  categoryName,
  onChange,
  index,
  onRemove,
}) => {
  const handleInputChange = (keyPath, value) => {
    onChange(keyPath, value);
  };
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

    onChange(`dependencies.${index}.`, updatedConditions);
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
    <TitledCollapse
      title={dependency.target || `Untargeted Dependency ${index + 1}`}
      onRemove={() => onRemove(`dependencies`, index)}
    >
      {/* Dependency Target */}
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel
          id="category-dependency-label"
          sx={{ backgroundColor: 'background.paper' }}
        >
          Category Dependency
        </InputLabel>
        <Select
          labelId="category-dependency-label"
          id="category-dependency"
          value={dependency.target || 'Choose an option'}
          onChange={(e) =>
            onChange(`dependencies.${index}.target`, e.target.value)
          }
        >
          <MenuItem value="Choose an option">Choose an option</MenuItem>
          {getOptions(dependency.target).map((option) => (
            <MenuItem key={option.value} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Dependency Conditions */}
      {dependency.target && (
        <Box>
          <Typography variant="h4">
            Modifiers for {dependency.target}:
          </Typography>
          {categories
            .find((cat) => cat.name === dependency.target)
            ?.thresholds.map((threshold, condIndex) => (
              <Box key={condIndex}>
                <ValidatedInput
                  label={`${threshold.rating}`}
                  type="number"
                  value={
                    dependencies[index].conditions[condIndex]?.modifier || 0
                  }
                  onChange={handleInputChange}
                  validated={
                    dependency.conditions?.find(
                      (cond) => cond.rating === threshold.rating
                    )?.modifier >= 0 &&
                    dependency.conditions?.find(
                      (cond) => cond.rating === threshold.rating
                    )?.modifier <= 5
                  }
                  validation={(value) => value >= 0 && value <= 5}
                  keyPath={`dependencies.${index}.conditions.${condIndex}.modifier`}
                  errorText="Modifier must be between 0 and 5"
                />
              </Box>
            ))}
        </Box>
      )}
    </TitledCollapse>
  );
};

export default DependencyForm;
