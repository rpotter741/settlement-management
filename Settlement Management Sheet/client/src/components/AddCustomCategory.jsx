import React, { useState } from "react";
import axios from "axios";

const AddCustomCategory = ({ settlementId }) => {
  const [categoryName, setCategoryName] = useState("");
  const [subComponents, setSubComponents] = useState([
    { name: "", max: 0, bonus: 0 },
  ]);
  const [settings, setSettings] = useState({ baseCost: 0 });

  const handleAddSubComponent = () => {
    if (subComponents.length < 3) {
      setSubComponents([...subComponents, { name: "", max: 0, bonus: 0 }]);
    } else {
      alert("You can only add up to 3 sub-components.");
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        `/settlement/${settlementId}/custom-category`,
        {
          name: categoryName,
          subComponents,
          settings,
        }
      );
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to add custom category.");
    }
  };

  return (
    <div>
      <h3>Add Custom Category</h3>
      <input
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <button onClick={handleAddSubComponent}>Add Sub-Component</button>
      {subComponents.map((sub, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Sub-Component Name"
            value={sub.name}
            onChange={(e) =>
              setSubComponents(
                subComponents.map((s, i) =>
                  i === index ? { ...s, name: e.target.value } : s
                )
              )
            }
          />
          <input
            type="number"
            placeholder="Max Value"
            value={sub.max}
            onChange={(e) =>
              setSubComponents(
                subComponents.map((s, i) =>
                  i === index ? { ...s, max: parseInt(e.target.value) } : s
                )
              )
            }
          />
          <input
            type="number"
            placeholder="Bonus"
            value={sub.bonus}
            onChange={(e) =>
              setSubComponents(
                subComponents.map((s, i) =>
                  i === index ? { ...s, bonus: parseInt(e.target.value) } : s
                )
              )
            }
          />
        </div>
      ))}
      <input
        type="number"
        placeholder="Base Cost"
        value={settings.baseCost}
        onChange={(e) =>
          setSettings({ ...settings, baseCost: parseInt(e.target.value) })
        }
      />
      <button onClick={handleSave}>Save Custom Category</button>
    </div>
  );
};

export default AddCustomCategory;
