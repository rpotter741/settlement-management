import React, { useState } from 'react';
import InputWithLabel from '../../shared/InputWithLabel/InputWithLabel';
import Button from '../../shared/Button/Button';
import TextAreaWithLabel from '../../shared/TextAreaWithLabel/TextAreaWithLabel';
import NewPhase from './components/NewPhase';
import Drawer from '../../shared/Drawer/Drawer';

import { emptyPhase } from '../../../helpers/events/emptyEventObjects';

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
    const newPhases = [...phases];
    newPhases.filter((_, i) => i !== index);
    setPhases(newPhases);
  };

  return (
    <div className="flex flex-col items-center w-full px-4">
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
      <h4 className="text-xl font-bold">Phases</h4>
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
      <Button onClick={handleAddPhase}>Add Phase</Button>
    </div>
  );
};

export default CustomEvent;
