import React, { useState } from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import TextAreaWithLabel from '../../../shared/TextAreaWithLabel/TextAreaWithLabel';
import FloatingSelect from '../../../shared/FloatingSelect/FloatingSelect';
import Button from '../../../shared/Button/Button';
import Drawer from '../../../shared/Drawer/Drawer';

import NewImpact from './NewImpact';
import NewImpactTable from './NewImpactTable';

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

  const handleRemoveImpact = (impactType, index) => {
    const newImpacts = phase.impacts[impactType].filter((_, i) => i !== index);
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
        value={phase.type}
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
      {index === 0 && (
        <div>
          <p className="mb-4">
            Impacts allow events to affect the settlement in meaningful ways:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>Costs</strong>: Resources deducted from the settlement.
            </li>
            <li>
              <strong>Rewards</strong>: Benefits or resources granted to the
              settlement.
            </li>
            <li>
              <strong>Base Amount</strong>: The default value for both costs and
              rewards.
            </li>
            <li>
              <strong>Immutable</strong>: If set to <strong>true</strong>, costs
              remain fixed. Otherwise, costs scale based on:
              <ul className="list-disc pl-6">
                <li>Settlement level</li>
                <li>Event severity</li>
              </ul>
            </li>
          </ul>

          <p className="mb-4">
            Event severity affects the <strong>Base Amount</strong> by applying
            a multiplier:
          </p>

          <details className="bg-background p-4 rounded-md border border-minor-two">
            <summary className="cursor-pointer text-primary font-bold">
              Show Severity Multipliers
            </summary>
            <table className="table-auto w-full mt-4 border-collapse border border-minor-two">
              <thead>
                <tr className="bg-accent-two text-primary">
                  <th className="border border-minor-two px-4 py-2">
                    Severity
                  </th>
                  <th className="border border-minor-two px-4 py-2">
                    Multiplier
                  </th>
                  <th className="border border-minor-two px-4 py-2">
                    Example (Base Amount = 100)
                  </th>
                  <th className="border border-minor-two px-4 py-2">
                    Chance of Severity Level
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-minor-two px-4 py-2">Trivial</td>
                  <td className="border border-minor-two px-4 py-2">0.25</td>
                  <td className="border border-minor-two px-4 py-2">25</td>
                  <td className="border border-minor-two px-4 py-2">12%</td>
                </tr>
                <tr>
                  <td className="border border-minor-two px-4 py-2">Minor</td>
                  <td className="border border-minor-two px-4 py-2">0.5</td>
                  <td className="border border-minor-two px-4 py-2">50</td>
                  <td className="border border-minor-two px-4 py-2">25%</td>
                </tr>
                <tr>
                  <td className="border border-minor-two px-4 py-2">
                    Moderate
                  </td>
                  <td className="border border-minor-two px-4 py-2">1</td>
                  <td className="border border-minor-two px-4 py-2">100</td>
                  <td className="border border-minor-two px-4 py-2">33%</td>
                </tr>
                <tr>
                  <td className="border border-minor-two px-4 py-2">Major</td>
                  <td className="border border-minor-two px-4 py-2">1.25</td>
                  <td className="border border-minor-two px-4 py-2">125</td>
                  <td className="border border-minor-two px-4 py-2">22%</td>
                </tr>
                <tr>
                  <td className="border border-minor-two px-4 py-2">
                    Catastrophic
                  </td>
                  <td className="border border-minor-two px-4 py-2">1.75</td>
                  <td className="border border-minor-two px-4 py-2">175</td>
                  <td className="border border-minor-two px-4 py-2">8%</td>
                </tr>
              </tbody>
            </table>
          </details>
        </div>
      )}
      <h5 className="text-xl font-bold mb-4">Costs</h5>
      <Button onClick={() => handleAddImpact('costs')}>Add Cost</Button>
      <NewImpactTable
        impacts={phase.impacts?.costs || []}
        setImpacts={(newImpacts) =>
          setPhase({
            ...phase,
            impacts: {
              ...phase.impacts,
              costs: newImpacts,
            },
          })
        }
      />

      <h5 className="text-xl font-bold mt-8 mb-4">Rewards</h5>
      <Button onClick={() => handleAddImpact('rewards')}>Add Reward</Button>
      <NewImpactTable
        impacts={phase.impacts?.rewards || []}
        setImpacts={(newImpacts) =>
          setPhase({
            ...phase,
            impacts: {
              ...phase.impacts,
              rewards: newImpacts,
            },
          })
        }
      />
    </div>
  );
};

export default NewPhase;
