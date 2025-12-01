import Weather from '../classes/weatherClass';

const defaultWeather = [
  { name: 'Clear', effects: [] },
  {
    name: 'Drought',
    effects: [
      { target: 'Food', attribute: 'current', value: 2, type: 'attrition' },
      { target: 'Health', attribute: 'current', value: 5, type: 'attrition' },
      { target: 'Supplies', attribute: 'current', value: 1, type: 'attrition' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Flood',
    effects: [
      { target: 'Supplies', attribute: 'current', value: 2, type: 'attrition' },
      {
        target: 'Defensive Infrastructure',
        attribute: 'current',
        value: 1,
        type: 'attrition',
      },
      {
        target: 'Labor Pool',
        attribute: 'current',
        value: 1,
        type: 'attrition',
      },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Cold Snap',
    effects: [
      { target: 'Food', attribute: 'current', value: 1, type: 'attrition' },
      { target: 'Health', attribute: 'current', value: 3, type: 'attrition' },
      { target: 'Supplies', attribute: 'current', value: 1, type: 'attrition' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Heatwave',
    effects: [
      { target: 'Health', attribute: 'current', value: 3, type: 'attrition' },
      { target: 'Supplies', attribute: 'current', value: 1, type: 'attrition' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Pestilence',
    effects: [
      { target: 'Health', attribute: 'current', value: 4, type: 'attrition' },
      {
        target: 'Medical Capacity',
        attribute: 'current',
        value: 1,
        type: 'attrition',
      },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Blight',
    effects: [
      { target: 'Food', attribute: 'current', value: 3, type: 'attrition' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Windstorm',
    effects: [
      {
        target: 'Defensive Infrastructure',
        attribute: 'current',
        value: 2,
        type: 'attrition',
      },
      { target: 'Supplies', attribute: 'current', value: 1, type: 'attrition' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Unseasonable Weather',
    effects: [
      { target: 'Food', attribute: 'current', value: 1, type: 'attrition' },
      { target: 'Supplies', attribute: 'current', value: 1, type: 'attrition' },
    ],
    step: 0,
    maxStep: 5,
  },
  {
    name: 'Abundant Rainfall',
    effects: [
      { target: 'Food', attribute: 'current', value: 2, type: 'retention' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 3,
  },
  {
    name: 'Mild Season',
    effects: [
      { target: 'Supplies', attribute: 'current', value: 1, type: 'retention' },
      { target: 'Health', attribute: 'current', value: 1, type: 'retention' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 3,
  },
  {
    name: 'Trade Winds',
    effects: [
      { target: 'Supplies', attribute: 'current', value: 2, type: 'retention' },
      { target: 'Economy', attribute: 'bonus', value: 1, type: 'retention' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 3,
  },
  {
    name: 'Bountiful Harvest',
    effects: [
      { target: 'Food', attribute: 'current', value: 3, type: 'retention' },
    ],
    customIntegrations: [],
    step: 0,
    maxStep: 3,
  },
];

const initializeWeather = () => {
  return defaultWeather.map(
    (weather) =>
      new Weather(
        weather.name,
        weather.effects,
        weather.customIntegrations,
        weather.step,
        weather.maxStep
      )
  );
};

export default initializeWeather;
