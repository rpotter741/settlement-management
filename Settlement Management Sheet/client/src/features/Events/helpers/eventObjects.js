import { v4 as newId } from 'uuid';

const newPhase = (length) => {
  return {
    id: newId(),
    name: `Phase ${length + 1}`,
    description: '',
    flavorText: {
      trivial: '',
      minor: '',
      notable: '',
      significant: '',
      major: '',
    },
    type: 'Active',
    impacts: [],
    resolutions: [],
    nextPhaseId: null,
    duration: null,
    productivity: null,
    exposedKeys: [],
    isTerminal: false,
  };
};

const newResolution = (length) => {
  return {
    id: newId(),
    name: `Resolution ${length + 1}`,
    description: '',
    impacts: [],
    keys: [],
  };
};

export { newPhase, newResolution };
