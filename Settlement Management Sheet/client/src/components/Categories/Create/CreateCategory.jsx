import { Box, Button, Typography } from '@mui/material';
import ValidatedInput from '../../utils/ValidatedTextArea/ValidatedInput';

import AttributeForm from './components/Attributes/AttributeForm';
import AttributePreview from './components/Attributes/AttributePreview';
import DependencyForm from './components/DependencyForm/DependencyForm';
import TitledCollapse from '../../utils/TitledCollapse/TitledCollapse';

import categories from '../../../helpers/categories/categories';
import categorySidebar from '../../../helpers/categories/createCategorySidebar.js';
import { useDynamicSidebar } from '../../../context/SidebarContext';

import {
  emptyCategory,
  emptyThreshold,
  emptyDependency,
  emptyAttribute,
} from '../../../helpers/categories/emptyCategoryObjects.js';

import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addCategory,
  updateCategory,
  selectCategoryById,
  selectAllCategories,
} from '../../../features/category/categoriesSlice.js';

const CreateCategory = ({ category, setCategory }) => {
  const [level, setLevel] = useState(1); // Default level is 1
  const { updateHandlers, updateContent } = useDynamicSidebar();
  const [attributes, setAttributes] = useState(false);
  const [thresholds, setThresholds] = useState(false);
  const [dependencies, setDependencies] = useState(false);
  const [attributeOpen, setAttributeOpen] = useState(
    new Array(category.attributes.length || 1).fill(false)
  );

  const dispatch = useDispatch();

  const selectedCategoryId = useSelector((state) => state.selection.category);
  const selectedCategory = useSelector((state) =>
    selectedCategoryId ? selectCategoryById(state, selectedCategoryId) : null
  );

  useEffect(() => {
    if (!selectedCategoryId) {
      const newCategoryId = `temp-${Date.now()}`;
      dispatch(
        addCategory({
          id: newCategoryId,
          name: '',
          description: '',
          attributes: [],
          thresholds: [],
          dependencies: [],
        })
      );
      dispatch(updateCategory(newCategoryId));
    }
  }, [selectedCategoryId, dispatch]);

  const handleCategoryUpdate = (updates) => {
    if (selectedCategoryId) {
      dispatch(updateCategory({ id: selectedCategoryId, ...updates }));
    }
  };

  const handleLevelChange = (val) => {
    const value = Math.max(1, Math.min(20, Number(val)));
    setLevel(value);
  };

  const handleChange = (keyPath, value) => {
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
      updateNestedObject(updatedCategory, keyPath.split('.'), value);
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

    let attrs = [...attributeOpen].map(() => false);
    attrs.splice(index, 1);
    setAttributeOpen(attrs);
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

  const handleFocus = (index) => {
    setAttributeOpen(
      (prev) => prev.map((open, i) => (i === index ? !open : false)) // Close all others
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        height: '100%',
        overflowY: 'scroll',
        boxShadow: 3,
        borderRadius: 4,
        p: 2,
        mr: 1,
        backgroundColor: 'background.default',
        maxWidth: ['100%', '80%', '60%', '49%'],
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
      <ValidatedInput
        fullWidth
        label="Category Name"
        value={selectedCategory?.name}
        onChange={(value) => handleCategoryUpdate({ name: value })}
        validation={(value) => value.length >= 3}
        validated={(value) => value.length >= 3}
        errorText="Category name must be at least 3 characters"
      />
      {/* Attributes Section */}
      <TitledCollapse
        title="Attributes"
        titleType="h5"
        styles={{ width: '100%', mt: 2 }}
        defaultState={attributes}
        noDefaultHandler={() => setAttributes(!attributes)}
      >
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: [
              '1fr',
              '1fr',
              '1fr 1fr',
              '1fr 1fr',
              '1fr 1fr 1fr',
            ],
            gridAutoFlow: 'row dense',
          }}
        >
          {category.attributes.map((attr, index) => (
            <Box
              sx={{
                gridArea: attributeOpen[index] ? '1 / 1 / 2 / 4' : 'auto',
                transition: 'all 0.3s ease-in-out', // Smooth transitions
              }}
            >
              <TitledCollapse
                id={`attribute-${index}`}
                key={index}
                title={attr.name ? attr.name : `Attribute ${index + 1}`}
                onRemove={() => handleRemoveItem('attributes', index)}
                titleType="h6"
                styles={{
                  width: '100%',
                  mt: 2,
                }}
                PreviewComponent={AttributePreview}
                previewProps={{ attribute: attr }}
                noDefaultHandler={() => handleFocus(index)}
                defaultState={attributeOpen[index]}
              >
                <AttributeForm
                  attr={attr}
                  index={index}
                  onChange={handleAttributeChange}
                  level={level}
                />
              </TitledCollapse>
            </Box>
          ))}
        </Box>
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
            onClick={() => {
              handleAddItem('attributes', { ...emptyAttribute });
              setAttributeOpen([...attributeOpen, false]);
            }}
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
        defaultState={thresholds}
        noDefaultHandler={() => setThresholds(!thresholds)}
      >
        <Box
          sx={{
            mt: 2,
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'start',
          }}
        >
          {category.thresholds.map((threshold, index) => (
            <Box
              key={index}
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
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
                fullWidth
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
                fullWidth
              />
            </Box>
          ))}
        </Box>
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
        defaultState={dependencies}
        noDefaultHandler={() => setDependencies(!dependencies)}
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
