import React, { useState } from 'react';
import InputWithLabel from '../../shared/InputWithLabel/InputWithLabel';
import Button from '../../shared/Button/Button';
import TextAreaWithLabel from '../../shared/TextAreaWithLabel/TextAreaWithLabel';
import NewPhase from './components/NewPhase';
import NewCondition from './components/NewCondition';
import Drawer from '../../shared/Drawer/Drawer';

import { emptyPhase } from '../../../helpers/events/emptyEventObjects';
import ConditionsDetails from '../../../helpers/events/ConditionsDetails';

const CustomEvent = ({ event, setEvent }) => {
  const [phases, setPhases] = useState(event.phases || []);

  const handleSetPhase = (index, newPhase) => {
    setPhases((prev) =>
      prev.map((phase, i) => (i === index ? newPhase : phase))
    );
  };

  const handleAddPhase = () => {
    setPhases([...phases, { ...emptyPhase }]);
  };

  const handleRemovePhase = (_, index) => {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center w-full p-6 relative">
      <div className="custom-event-sidebar">
        <h3 className="text-3xl font-bold m-4">Event Overview</h3>
        <InputWithLabel
          label="Event Name"
          value={event.name}
          onChange={(e) => setEvent({ ...event, name: e.target.value })}
        />
        <TextAreaWithLabel
          label="Event Description"
          value={event.details}
          onChange={(e) => setEvent({ ...event, details: e.target.value })}
        />
        <h5 className="text-2xl font-bold m-4">Event Conditions</h5>
        <ConditionsDetails />
        <NewCondition
          key={Math.random()}
          condition={event.conditions}
          setCondition={(newCondition) => {
            setEvent({ ...event, conditions: newCondition });
          }}
        />
        <details>
          <summary className="text-2xl font-bold m-4">
            Flavor Text (Optional)
          </summary>
          <p>
            You can specify flavor text for each severity here. If empty, that
            severity will default to the event description.
          </p>
          {Object.entries(event.flavorText).map(([key, value], index) => (
            <TextAreaWithLabel
              key={index}
              label={`${key[0].toUpperCase()}${key.slice(1)}`}
              value={value}
              onChange={(e) => {
                setEvent({
                  ...event,
                  flavorText: {
                    ...event.flavorText,
                    [key]: e.target.value,
                  },
                });
              }}
            />
          ))}
        </details>
      </div>
    </div>
  );
};

export default CustomEvent;
