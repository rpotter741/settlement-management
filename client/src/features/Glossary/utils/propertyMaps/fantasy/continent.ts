import GlossaryAutocomplete from '@/components/shared/DynamicForm/GlossaryAutocomplete.js';

const continentPropertyArrayMap = [
  {
    name: 'Geography',
    children: [
      {
        multiple: false,
        component: GlossaryAutocomplete,
        keypath: 'climates',
      },
      {
        multiple: true,
        keypath: 'terrain',
      },
      {
        multiple: true,
        keypath: 'regions',
      },
    ],
  },
  {
    name: 'Politics',
    children: [
      {
        multiple: true,
        keypath: 'nations',
        label: 'Nations',
      },
      {
        multiple: true,
        keypath: 'settlements',
        label: 'Settlements',
      },
      {
        multiple: true,
        keypath: 'locations',
        label: 'Locations',
      },
      {
        multiple: true,
        keypath: 'resources',
        label: 'Resources',
      },
      {
        multiple: false,
        keypath: 'population',
        label: 'Population',
      },
    ],
  },
  {
    name: 'History',
    children: [
      {
        multiple: true,
        keypath: 'events',
        label: 'Event Log',
      },
      {
        multiple: false,
        keypath: 'history',
        label: 'History',
      },
    ],
  },
];

export default continentPropertyArrayMap;
