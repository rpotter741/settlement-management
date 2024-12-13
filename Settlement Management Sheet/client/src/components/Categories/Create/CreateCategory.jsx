import React, { useState } from 'react';
import {
  emptyCategory,
  emptyThreshold,
  emptyDependency,
  emptyAttribute,
} from '../../../helpers/categories/emptyCategoryObjects.js';
import AttributeForm from './components/Attributes/AttributeForm';
import Dependencies from './components/Dependency/Dependencies';
import './CreateCategory.css'; // Import the CSS file
import InputWithLabel from '../../shared/InputWithLabel/InputWithLabel';
import Drawer from '../../shared/Drawer/Drawer';

const categories = [
  {
    name: 'Select A Category',
    thresholds: [],
  },
  {
    name: 'Economy',
    thresholds: [
      { max: 2, rating: 'Struggling' },
      { max: 3, rating: 'Fragile' },
      { max: 4, rating: 'Stagnant' },
      { max: 5, rating: 'Growing' },
      { max: 7, rating: 'Prosperous' },
      { max: 8, rating: 'Thriving' },
      { max: Infinity, rating: 'Golden Era' },
    ],
  },
  {
    name: 'Safety',
    thresholds: [
      { max: 1, rating: 'Dangerous' },
      { max: 2, rating: 'Lawless' },
      { max: 4, rating: 'Unsafe' },
      { max: 6, rating: 'Safe' },
      { max: 8, rating: 'Guarded' },
      { max: 9, rating: 'Protected' },
      { max: Infinity, rating: 'Impregnable' },
    ],
  },
  {
    name: 'Survival',
    thresholds: [
      { max: 0.9, rating: 'Dying' },
      { max: 3.9, rating: 'Endangered' },
      { max: 4.9, rating: 'Unstable' },
      { max: 6.9, rating: 'Stable' },
      { max: 7.9, rating: 'Developing' },
      { max: 9, rating: 'Blossoming' },
      { max: Infinity, rating: 'Flourishing' },
    ],
  },
];

const CreateCategory = () => {
  const [category, setCategory] = useState(emptyCategory);
  const [level, setLevel] = useState(1);

  const handleLevelChange = (e) => {
    const value = Math.max(1, Math.min(20, Number(e.target.value)));
    setLevel(value);
    handleChange('settlementLevel', value);
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
    <div className="create-category-container">
      <h1 className="create-category-title">Create Custom Category</h1>

      <div className="create-category-section">
        <InputWithLabel
          id="settlement-level"
          label="Settlement Level"
          value={level}
          onChange={handleLevelChange}
          type="number"
        />
      </div>

      <div className="create-category-section">
        <InputWithLabel
          id="category-name"
          label="Category Name"
          value={category.name}
          onChange={(e) => handleChange('name', e.target.value)}
          type="text"
        />
      </div>

      <div className="create-category-section">
        <h2>Attributes</h2>
        <p>
          Attributes define key characteristics of the category. Each attribute
          contains
          <strong> base values</strong>,{' '}
          <strong>attrition/retention rates</strong>, and
          <strong> settlement point costs</strong>. These are used to calculate
          the overall category score and its impacts on the settlement.
        </p>
        {category.attributes.map((attr, index) => (
          <Drawer
            key={index}
            header={`Attribute ${index + 1}`}
            onRemove={() => handleRemoveItem('attributes', index)}
            index={index}
            type="attribute"
          >
            <AttributeForm
              key={index}
              attr={attr}
              index={index}
              onChange={handleAttributeChange}
              onRemove={() => handleRemoveItem('attributes', index)}
              level={parseInt(level)}
            />
          </Drawer>
        ))}
        <button
          className="create-category-button add-button"
          onClick={() => handleAddItem('attributes', { ...emptyAttribute })}
        >
          Add Attribute
        </button>
      </div>

      <div className="create-category-section">
        <h2>Thresholds</h2>
        <p>
          Thresholds specify the score, based on a 10-point scale, for the
          category rating. For example, with <strong>Survival</strong>, the
          thresholds might look like this:
        </p>
        <ul className="thresholds-list">
          <li>
            <span className="threshold-score">0.9:</span>{' '}
            <span className="threshold-label">Dying</span>
          </li>
          <li>
            <span className="threshold-score">3.9:</span>{' '}
            <span className="threshold-label">Endangered</span>
          </li>
          <li>
            <span className="threshold-score">4.9:</span>{' '}
            <span className="threshold-label">Unstable</span>
          </li>
          <li>
            <span className="threshold-score">6.9:</span>{' '}
            <span className="threshold-label">Stable</span>
          </li>
          <li>
            <span className="threshold-score">7.9:</span>{' '}
            <span className="threshold-label">Developing</span>
          </li>
          <li>
            <span className="threshold-score">9:</span>{' '}
            <span className="threshold-label">Blossoming</span>
          </li>
          <li>
            <span className="threshold-score">10:</span>{' '}
            <span className="threshold-label">Flourishing</span>
          </li>
        </ul>
        <p>
          In this case, if the score is at or below <strong>3.9</strong>, the
          category is
          <strong> Endangered</strong>. These ratings are used for player
          feedback about the status of the category and may be tied to other
          categories to adjust their scores (see <strong>Dependencies</strong>{' '}
          below). Scores are automatically calculated based on current values,
          bonuses, and max values.
        </p>
        {category.thresholds.map((thr, index) => (
          <div key={index} className="create-category-item">
            <InputWithLabel
              id={`threshold-max-${index}`}
              label="Max Value"
              value={thr.max}
              onChange={(e) =>
                handleChange(`thresholds.${index}.max`, Number(e.target.value))
              }
              type="number"
            />
            <InputWithLabel
              id={`threshold-rating-${index}`}
              label="Rating"
              value={thr.rating}
              onChange={(e) =>
                handleChange(`thresholds.${index}.rating`, e.target.value)
              }
              type="text"
            />
            <button
              className="create-category-button remove-button"
              onClick={() => handleRemoveItem('thresholds', index)}
            >
              Remove Threshold
            </button>
          </div>
        ))}
        <button
          className="create-category-button add-button"
          onClick={() => handleAddItem('thresholds', { ...emptyThreshold })}
        >
          Add Threshold
        </button>
      </div>

      <div className="create-category-section">
        <h2>Dependencies</h2>
        <p>
          Dependencies adjust the category score based on other categories. When
          selecting another category, you'll see input fields for each of that
          category's thresholds. Dependency modifiers have a range of 0 - 5 in
          0.1 increments. If you want to double the score at a given rating,
          you'd put 2. If you want to half the score, you'd put 0.5. Putting a
          modifier of 0 will make this category's score 0 at that rating.
          Dependencies are multiplied together to calculate the final score.
        </p>
        {category.dependencies.map((dep, index) => (
          <Drawer
            key={index}
            header={`Dependency ${index + 1}`}
            onRemove={() => handleRemoveItem('dependencies', index)}
            index={index}
            type="dependency"
          >
            <Dependencies
              key={index}
              dependencies={category.dependencies}
              dep={dep}
              index={index}
              categories={categories}
              onChange={handleChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
            />
          </Drawer>
        ))}
        <button
          className="create-category-button add-button"
          onClick={() => handleAddItem('dependencies', emptyDependency)}
        >
          Add Dependency
        </button>
      </div>

      <button
        className="create-category-button export-button"
        onClick={exportToJson}
      >
        Export to JSON
      </button>
    </div>
  );
};

export default CreateCategory;
