import React, { useState } from 'react';
import InputWithLabel from '../../../shared/InputWithLabel/InputWithLabel';
import Button from '../../../shared/Button/Button';
import {
  Box,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
} from '@mui/material';
import ValidatedInput from '../../../utils/ValidatedInput';
import ValidatedTextArea from '../../../utils/ValidatedTextArea/ValidatedTextArea';

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

  const showLabor = phase.type === 'Active';
  const showDuration = phase.type === 'Active' || phase.type === 'Passive';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        width: '100%',
        height: '100%',
        overflowY: 'scroll',
        boxShadow: 3,
        p: 2,
        mr: 1,
        backgroundColor: 'background.default',
        gap: 2,
      }}
    >
      <ValidatedInput
        label="Phase Name"
        value={phase.name}
        onChange={(value) => setPhase(index, { ...phase, name: value })}
        required
        validated={phase.name.length >= 3}
        validation={(value) => value.length >= 3}
        errorText="Phase name must be at least 3 characters long"
      />
      <FormControl>
        <InputLabel id={`phase-${index + 1}-type`}>Phase Type</InputLabel>
        <Select
          label="Phase Type"
          value={phase.type}
          onChange={(e) => {
            setPhase(index, { ...phase, type: e.target.value });
          }}
          sx={{ textAlign: 'left', mb: 1.5 }}
        >
          <MenuItem value="Select an option" disabled>
            Select an option
          </MenuItem>
          {phaseTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {showDuration && (
        <ValidatedInput
          label="Duration (in days)"
          value={phase.timeInDays}
          onChange={(value) => setPhase(index, { ...phase, timeInDays: value })}
          required
          validated={phase.timeInDays >= 1}
          validation={(value) => value >= 1}
          errorText="Duration must be at least 1 day"
        />
      )}
      {showLabor && (
        <ValidatedInput
          label="Labor Needed"
          value={phase.laborNeeded}
          onChange={(value) =>
            setPhase(index, { ...phase, laborNeeded: value })
          }
          required
          validated={phase.timeInDays >= 0}
          validation={(value) => value >= 0}
          errorText="Duration must be a positive number"
        />
      )}
      <ValidatedTextArea
        label="Description"
        value={phase.description}
        onChange={(value) => setPhase(index, { ...phase, description: value })}
        required
        validated={phase.description?.length >= 0}
        validation={(value) => value?.length >= 0}
        errorText="Description cannot be blank"
      />

      <Typography variant="h4">Impacts</Typography>
      {/* {index === 0 && (
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
      )} */}
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
    </Box>
  );
};

export default NewPhase;

/*

*/
