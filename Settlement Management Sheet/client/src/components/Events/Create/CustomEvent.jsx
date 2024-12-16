import React, { useState } from 'react';
import InputWithLabel from '../../shared/InputWithLabel/InputWithLabel';
import Button from '../../shared/Button/Button';
import TextAreaWithLabel from '../../shared/TextAreaWithLabel/TextAreaWithLabel';
import NewPhase from './components/NewPhase';
import NewCondition from './components/NewCondition';
import Drawer from '../../shared/Drawer/Drawer';

import { emptyPhase } from '../../../helpers/events/emptyEventObjects';
import PhasesDetails from '../../../helpers/events/PhasesDetails';

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
    <div className="flex flex-col items-center w-full p-6">
      {/* Event Name Input */}
      <InputWithLabel
        label="Event Name"
        value={event.name}
        onChange={(e) => setEvent({ ...event, name: e.target.value })}
      />

      {/* Event Description Text Area */}
      <TextAreaWithLabel
        label="Event Description"
        value={event.details}
        onChange={(e) => setEvent({ ...event, details: e.target.value })}
      />

      {/* Phases Section */}
      <h4 className="text-xl font-bold mt-6 mb-4">Phases</h4>
      <PhasesDetails />
      {phases.map((phase, index) => (
        <Drawer
          key={index}
          header={phase.name || `Phase ${index + 1}`}
          onRemove={() => handleRemovePhase('', index)}
          index={index}
        >
          <NewPhase
            phase={phase}
            setPhase={(newPhase) => handleSetPhase(index, newPhase)}
            index={index}
          />
        </Drawer>
      ))}

      {/* Add Phase Button */}
      <Button
        onClick={handleAddPhase}
        className="mt-4 bg-accent text-background font-semibold py-2 px-4 rounded"
      >
        Add Phase
      </Button>
      <h5 className="text-lg font-bold">Conditions</h5>

      <NewCondition
        key={Math.random()}
        condition={event.conditions}
        setCondition={(newCondition) => {
          setEvent({ ...event, conditions: newCondition });
        }}
      />
    </div>
  );
};

export default CustomEvent;
