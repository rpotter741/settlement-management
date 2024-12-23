const emptyEffect = {
  type: '',
  category: '',
  attribute: '',
  key: '',
  baseAmount: 0,
  immutable: false,
};

const emptyEvent = {
  eventId: '',
  step: 0,
  minTurn: 0,
};

const emptyWeather = {
  name: '',
  method: 'Simple',
  effects: {
    1: [
      {
        ...emptyEffect,
      },
    ],
  },
  maxSteps: 5,
};

export { emptyEffect, emptyEvent, emptyWeather };
