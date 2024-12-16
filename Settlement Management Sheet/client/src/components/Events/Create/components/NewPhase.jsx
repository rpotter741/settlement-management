import React, { useState } from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import TextAreaWithLabel from '../../../shared/TextAreaWithLabel/TextAreaWithLabel';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';
import Button from '../../../shared/Button/Button';
import Drawer from '../../../shared/Drawer/Drawer';

import NewImpact from './NewImpact';

import {
  emptyPhase,
  emptyImpact,
  emptyGuardImpact,
  phaseTypeOptions,
} from '../../../../helpers/events/emptyEventObjects';

const NewPhase = ({ phase, setPhase, index }) => {
  const handleAddImpact = (impactType) => {
    const newImpacts = [
      ...(phase.impacts[impactType] || []),
      { ...emptyImpact },
    ];
    setPhase({
      ...phase,
      impacts: {
        ...phase.impacts,
        [impactType]: newImpacts,
      },
    });
  };

  const handleSetImpact = (impactType, index, newImpact) => {
    const newImpacts = phase.impacts[impactType].map((imp, i) =>
      i === index ? newImpact : imp
    );
    setPhase({
      ...phase,
      impacts: {
        ...phase.impacts,
        [impactType]: newImpacts,
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      <InputWithLabel
        label="Phase Name"
        value={phase.name}
        onChange={(e) => setPhase({ ...phase, name: e.target.value })}
      />
      <FloatingSelect
        label="Phase Type"
        options={phaseTypeOptions}
        value={phase.type || 'Select a type'}
        onChange={(e) => setPhase({ ...phase, type: e.target.value })}
      />
      <TextAreaWithLabel
        label="Description"
        value={phase.details}
        onChange={(e) => setPhase({ ...phase, details: e.target.value })}
        className="h-32"
      />
      <InputWithLabel
        label="Duration (in days)"
        value={phase.timeInDays}
        onChange={(e) => setPhase({ ...phase, timeInDays: e.target.value })}
        type="number"
      />
      <InputWithLabel
        label="Labor Needed"
        value={phase.laborNeeded}
        onChange={(e) => setPhase({ ...phase, laborNeeded: e.target.value })}
        type="number"
      />
      <h4 className="text-xl font-bold mb-4 border-b w-full text-center pb-4">
        Impacts
      </h4>
      {index === 0 && <p>Some description about impacts here</p>}
      {Object.entries(phase.impacts || {}).map(([impactType, impacts]) => (
        <div key={impactType}>
          <h5 className="text-xl font-bold">
            {impactType.charAt(0).toUpperCase() + impactType.slice(1)}
          </h5>
          {impacts.map((impact, i) => (
            <Drawer
              key={i}
              header={`Impact ${i + 1}`}
              onRemove={() => console.log('Remove impact')}
              index={i}
            >
              <NewImpact
                impact={impact}
                setImpact={(newImpact) =>
                  handleSetImpact(impactType, i, newImpact)
                }
              />
            </Drawer>
          ))}
          <Button onClick={() => handleAddImpact(impactType)}>
            Add {impactType.slice(0, -1)}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default NewPhase;
