import { ulid as newId } from 'ulid';

function initializeStatus() {
  return {
    id: newId(),
    refId: newId(),
    version: 1,
    name: '',
    description: '',
    type: 'Weather',
    mode: 'Simple',
    steps: [
      {
        id: newId(),
        name: '',
        description: '',
        impacts: [
          {
            system: null,
            target: null,
            key: null,
            value: null,
          },
        ],
      },
      {
        id: newId(),
        name: '',
        description: '',
        impacts: [
          {
            system: null,
            target: null,
            key: null,
            value: null,
          },
        ],
      },
      {
        id: newId(),
        name: '',
        description: '',
        impacts: [
          {
            system: null,
            target: null,
            key: null,
            value: null,
          },
        ],
      },
      {
        id: newId(),
        name: '',
        description: '',
        impacts: [
          {
            system: null,
            target: null,
            key: null,
            value: null,
          },
        ],
      },
      {
        id: newId(),
        name: '',
        description: '',
        impacts: [
          {
            system: null,
            target: null,
            key: null,
            value: null,
          },
        ],
      },
    ],
    isValid: false,
    status: 'DRAFT',
    createdBy: '',
  };
}

export default initializeStatus;
