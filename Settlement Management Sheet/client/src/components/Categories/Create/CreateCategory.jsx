import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Collapse,
  Divider,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import ValidatedInput from '../../utils/ValidatedInput';

import AttributeForm from './components/Attributes/AttributeForm';
import DependencyForm from './components/DependencyForm/DependencyForm';
import TitledCollapse from '../../utils/TitledCollapse/TitledCollapse';
import useNestedObject from '../../../hooks/useNestedObject';

import categories from '../../../helpers/categories/categories';
import categorySidebar from '../../../helpers/categories/createCategorySidebar.js';
import { useDynamicSidebar } from '../../../context/SidebarContext';

import {
  emptyCategory,
  emptyThreshold,
  emptyDependency,
  emptyAttribute,
  exampleThresholds,
} from '../../../helpers/categories/emptyCategoryObjects.js';

import React, { useEffect, useState, useContext } from 'react';

const CreateCategory = ({ category, setCategory }) => {
  const [level, setLevel] = useState(1); // Default level is 1
  const { updateHandlers, updateContent } = useDynamicSidebar();

  const handleLevelChange = (val) => {
    const value = Math.max(1, Math.min(20, Number(val)));
    setLevel(value);
  };

  const handleChange = (keyPath, value) => {
    console.log(keyPath, value);
    const updateNestedObject = (obj, keys, val) => {
      if (keys.length === 1) {
        obj[keys[0]] = val;
        return obj;
      }
      const key = keys[0];
      if (!obj[key]) obj[key] = {};
      obj[key] = updateNestedObject(obj[key], keys.slice(1), val);
      return obj;
    };
    setCategory((prev) => {
      const updatedCategory = { ...prev };
      console.log(updatedCategory, 'before change');
      updateNestedObject(updatedCategory, keyPath.split('.'), value);
      console.log(updatedCategory, 'after change');
      return updatedCategory;
    });
  };

  const handleAddItem = (keyPath, newItem) => {
    setCategory((prev) => {
      const updatedCategory = structuredClone(prev); // Create a deep copy
      const keys = keyPath.split('.');
      const targetArray = keys.reduce((acc, key) => acc[key], updatedCategory);

      if (!Array.isArray(targetArray)) {
        console.error(`${keyPath} is not an array`);
        return prev;
      }

      targetArray.push(newItem);
      return updatedCategory;
    });
  };

  useEffect(() => {
    const handlers = [
      () => {
        console.log('adding attribute');
        handleAddItem('attributes', { ...emptyAttribute });
      },
      () => {
        handleAddItem('thresholds', { ...emptyThreshold });
      },
      () => {
        handleAddItem('dependencies', { ...emptyDependency });
      },
    ];
    updateHandlers(handlers);
    updateContent(categorySidebar);
  }, []);

  const handleRemoveItem = (keyPath, index) => {
    setCategory((prev) => {
      const updatedCategory = { ...prev }; // Create a shallow copy of the category
      const keys = keyPath.split('.');
      const targetArray = keys.reduce((acc, key) => acc[key], updatedCategory);

      if (Array.isArray(targetArray)) {
        // Replace the original array with a filtered version
        const filteredArray = targetArray.filter((_, i) => i !== index);
        keys.reduce((acc, key, idx) => {
          if (idx === keys.length - 1) {
            acc[key] = filteredArray; // Update the target array
          }
          return acc[key];
        }, updatedCategory);
      }

      return updatedCategory;
    });
  };

  const handleAttributeChange = (updatedAttr, index) => {
    const updatedAttributes = category.attributes.map((attr, i) =>
      i === index ? updatedAttr : attr
    );
    handleChange('attributes', updatedAttributes);
  };

  const exportToJson = () => {
    const jsonString = JSON.stringify(category, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.name || 'custom_category'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        boxShadow: 3,
        borderRadius: 4,
        p: 2,
        mr: 1,
        backgroundColor: 'background.default',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          mt: 2,
        }}
      >
        Create Category
      </Typography>
      {/* <ValidatedInput
        label="Settlement Level"
        value={level}
        onChange={handleLevelChange}
        validated={level >= 1 && level <= 20}
        validation={(value) => value >= 1 && value <= 20}
        errorText="Level must be between 1 and 20"
        type="number"
        sx={{ my: 1 }}
      /> */}
      <ValidatedInput
        label="Category Name"
        value={category.name}
        onChange={(value) => handleChange('name', value)}
        validation={(value) => value.length >= 3}
        validated={category.name.length >= 3}
        errorText="Category name must be at least 3 characters"
      />
      {/* Attributes Section */}
      <TitledCollapse
        title="Attributes"
        titleType="h5"
        styles={{ width: '100%', mt: 2 }}
      >
        {category.attributes.map((attr, index) => (
          <TitledCollapse
            key={index}
            title={attr.name ? attr.name : `Attribute ${index + 1}`}
            onRemove={() => handleRemoveItem('attributes', index)}
            titleType="h6"
            styles={{ width: '100%', mt: 2 }}
          >
            <AttributeForm
              attr={attr}
              index={index}
              onChange={handleAttributeChange}
              level={level}
            />
          </TitledCollapse>
        ))}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '12px 16px',
            width: '100%',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 4 }}
            onClick={() => handleAddItem('attributes', { ...emptyAttribute })}
          >
            {' '}
            Add Attribute{' '}
          </Button>
        </Box>
      </TitledCollapse>

      {/* Thresholds Section */}
      <TitledCollapse
        title="Thresholds"
        titleType="h5"
        styles={{ width: '100%', mt: 2 }}
      >
        {category.thresholds.map((threshold, index) => (
          <Box
            key={index}
            sx={{
              mt: 2,
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'space-between',
            }}
          >
            <ValidatedInput
              label="Max Value"
              value={threshold.max}
              type="number"
              step={0.1}
              onChange={handleChange}
              keyPath={`thresholds.${index}.max`}
              validation={(value) => value >= 0.1 && value <= 10}
              validated={threshold.max >= 0.1 && threshold.max <= 10}
              errorText="Max value must be between 0.1 and 10"
            />
            <ValidatedInput
              label="Rating"
              value={threshold.rating}
              onChange={handleChange}
              keyPath={`thresholds.${index}.rating`}
              validation={(value) => value.length >= 3}
              validated={threshold.rating.length >= 3}
              onRemove={() => handleRemoveItem('thresholds', index)}
              errorText="Rating must be at least 3 characters"
            />
          </Box>
        ))}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 4 }}
          onClick={() => handleAddItem('thresholds', { ...emptyThreshold })}
        >
          {' '}
          Add Threshold{' '}
        </Button>
      </TitledCollapse>

      {/* Dependencies Section */}
      <TitledCollapse
        title="Dependencies"
        titleType="h5"
        styles={{ width: '100%', mt: 2 }}
      >
        {category.dependencies.map((dep, index) => (
          <DependencyForm
            key={index}
            index={index}
            dependencies={category.dependencies}
            categories={categories}
            categoryName={category.name}
            dependency={dep}
            onChange={handleChange}
            onRemove={handleRemoveItem}
          />
        ))}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 4 }}
          onClick={() => handleAddItem('dependencies', { ...emptyDependency })}
        >
          {' '}
          Add Dependency{' '}
        </Button>
      </TitledCollapse>
    </Box>
  );
};

export default CreateCategory;
