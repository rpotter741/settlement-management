import { useState } from 'react';

const traverseAndUpdate = (obj, path, callback) => {
  const keys = path.match(/([^[.\]]+)/g); // Split by dots and brackets
  const updatedObj = { ...obj }; // Shallow clone to ensure immutability
  let current = updatedObj;

  keys.forEach((key, idx) => {
    if (idx === keys.length - 1) {
      // Final key: execute the callback
      current[key] = callback(current[key]);
    } else {
      current[key] = Array.isArray(current[key])
        ? [...current[key]]
        : { ...current[key] }; // Ensure immutability at every level
      current = current[key];
    }
  });
  console.log(updatedObj, obj);
  return updatedObj;
};

const updateNestedKey = (obj, path, value, index) => {
  return traverseAndUpdate(obj, path, (current) => {
    if (index !== undefined && Array.isArray(current)) {
      // Update specific array index
      return current.map((item, i) =>
        i === index ? { ...item, ...value } : item
      );
    }
    return value; // Standard key update
  });
};

const removeNestedIndex = (obj, path, index) => {
  return traverseAndUpdate(obj, path, (current) => {
    if (Array.isArray(current)) {
      return current.filter((_, i) => i !== index);
    }
    return current; // Return unchanged for non-array
  });
};

const addNestedObjectAtIndex = (obj, path, newItem) => {
  return traverseAndUpdate(obj, path, (current) => {
    if (Array.isArray(current)) {
      const updatedArray = [...current];
      updatedArray.push(newItem);
      return updatedArray;
    }
    return current; // Return unchanged for non-array
  });
};

const useNestedObject = (initialState) => {
  const [data, setData] = useState(initialState);

  const updateNestedValue = (path, value, index) => {
    setData((prev) => updateNestedKey(prev, path, value, index));
  };

  const removeNestedItem = (path, index) => {
    setData((prev) => removeNestedIndex(prev, path, index));
  };

  const addNestedItem = (path, newItem) => {
    setData((prev) => addNestedObjectAtIndex(prev, path, newItem));
  };

  return { data, updateNestedValue, removeNestedItem, addNestedItem };
};

export default useNestedObject;
