import { v4 as newId } from 'uuid';

function initializeEvent() {
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
    phases: [
      {
        id: newId(),
        name: 'Phase 1',
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
      },
    ],
  };
}

export default initializeEvent;
