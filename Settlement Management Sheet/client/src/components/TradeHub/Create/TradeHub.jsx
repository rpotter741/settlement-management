import React, { useState } from 'react';

const TradeHub = () => {
  const [hubDetails, setHubDetails] = useState({
    name: '',
    description: '',
    trends: 'neutral',
  });

  const [goods, setGoods] = useState([]);
  const [automationSettings, setAutomationSettings] = useState({
    trendOverrides: [],
    duration: 0,
  });

  const handleAddGood = (newGood) => {
    setGoods((prevGoods) => [...prevGoods, newGood]);
  };

  const handleUpdateGood = (index, updatedGood) => {
    setGoods((prevGoods) =>
      prevGoods.map((good, i) => (i === index ? updatedGood : good))
    );
  };

  const handleRemoveGood = (index) => {
    setGoods((prevGoods) => prevGoods.filter((_, i) => i !== index));
  };

  return (
    <div className="trade-hub-container">
      <h1>Create Trade Hub</h1>

      {/* Trade Hub Details */}
      <section className="trade-hub-details">
        <label>
          Name:
          <input
            type="text"
            value={hubDetails.name}
            onChange={(e) =>
              setHubDetails({ ...hubDetails, name: e.target.value })
            }
          />
        </label>
        <label>
          Description:
          <textarea
            value={hubDetails.description}
            onChange={(e) =>
              setHubDetails({ ...hubDetails, description: e.target.value })
            }
          />
        </label>
        <label>
          Base Trends:
          <select
            value={hubDetails.trends}
            onChange={(e) =>
              setHubDetails({ ...hubDetails, trends: e.target.value })
            }
          >
            <option value="neutral">Neutral</option>
            <option value="increasing">Increasing</option>
            <option value="decreasing">Decreasing</option>
          </select>
        </label>
      </section>

      {/* Goods Management */}
      <section className="trade-hub-goods">
        <h2>Manage Goods</h2>
        <button
          onClick={() => handleAddGood({ name: '', price: 0, quantity: 0 })}
        >
          Add Good
        </button>
        <ul>
          {goods.map((good, index) => (
            <li key={index}>
              {good.name} - {good.price} gold - {good.quantity} units
              <button onClick={() => handleUpdateGood(index, { ...good })}>
                Edit
              </button>
              <button onClick={() => handleRemoveGood(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Automation Settings */}
      <section className="trade-hub-automation">
        <h2>Automation Settings</h2>
        <label>
          Trend Duration:
          <input
            type="number"
            value={automationSettings.duration}
            onChange={(e) =>
              setAutomationSettings({
                ...automationSettings,
                duration: Number(e.target.value),
              })
            }
          />
        </label>
      </section>
    </div>
  );
};

export default TradeHub;
