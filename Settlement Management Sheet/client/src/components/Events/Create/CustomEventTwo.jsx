import React, { useState } from 'react';
import InputWithLabel from '../../shared/InputWithLabel/InputWithLabel';
import Button from '../../shared/Button/Button';
import TextAreaWithLabel from '../../shared/TextAreaWithLabel/TextAreaWithLabel';
import NewPhase from './components/NewPhase';
import NewCondition from './components/NewCondition';
import Drawer from '../../shared/Drawer/Drawer';

import { emptyPhase } from '../../../helpers/events/emptyEventObjects';
import ConditionsDetails from '../../../helpers/events/ConditionsDetails';
import DescriptionDetails from '../../../helpers/events/DescriptionDetails';
import EventTagsTable from './components/EventsTagTable';
import EventTagDetails from '../../../helpers/events/EventTagDetails';

import TabbedContainer from '../../utils/TabbedContainer';

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

  const getTabs = () => {
    let tabs = [];
    phases.forEach((phase, index) => {
      tabs.push(phase.name || `Phase ${index + 1}`);
    });
    tabs.push('+');
    return tabs;
  };

  return (
    <div className="relative grid grid-cols-2 gap-4">
      <div className="custom-event-sidebar">
        <div className="sticky top-0 bg-background z-10">
          <h3 className="text-3xl font-bold p-4">Event Overview</h3>
          <InputWithLabel
            label="Event Name"
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
          />
          <DescriptionDetails />
          <TextAreaWithLabel
            label="Event Description"
            value={event.details}
            onChange={(e) => setEvent({ ...event, details: e.target.value })}
          />
        </div>
        <details>
          <summary className="text-2xl font-bold m-4">Event Conditions</summary>
          <ConditionsDetails />
          <NewCondition
            key={Math.random()}
            condition={event.conditions}
            setCondition={(newCondition) => {
              setEvent({ ...event, conditions: newCondition });
            }}
          />
        </details>
        <details className="p-4 bg-background mb-4">
          <summary className="text-2xl font-bold m-4"> Event Tags</summary>
          <EventTagDetails />
          <EventTagsTable />
        </details>
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
      <div className="custom-event-content text-primary">
        <TabbedContainer
          tabs={getTabs()}
          onAdd={handleAddPhase}
          onRemove={handleRemovePhase}
        >
          {phases.map((phase, index) => (
            <NewPhase
              key={index}
              phase={phase}
              setPhase={(newPhase) => handleSetPhase(index, newPhase)}
              onRemovePhase={handleRemovePhase}
            />
          ))}
        </TabbedContainer>
      </div>
    </div>
  );
};

export default CustomEvent;
