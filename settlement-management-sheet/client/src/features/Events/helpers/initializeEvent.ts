import { ulid as newId } from 'ulid';

function initializeEvent() {
  const phaseId = newId();

  const phases = {
    data: {},
    order: [],
  };

  const phase = {
    id: phaseId,
    name: 'Phase 1',
    description: '',
    flavorText: {
      trivial: '',
      minor: '',
      notable: '',
      significant: '',
      major: '',
    },
    type: 'Immediate',
    impacts: [],
    resolutions: [
      {
        id: newId(),
        name: 'Resolution 1',
        description: '',
        impacts: [],
        keys: [],
      },
    ],
    nextPhaseId: null,
    duration: null,
    productivity: null,
    exposedKeys: [],
    isTerminal: false,
  };

  phases.data[phaseId] = phase;
  phases.order.push(phaseId);

  return {
    id: newId(),
    refId: newId(),
    version: 1,
    name: '',
    description: '',
    tags: [],
    isValid: false,
    status: 'DRAFT',
    createdBy: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    narrativeWeight: null,
    phases,
  };
}

export default initializeEvent;
