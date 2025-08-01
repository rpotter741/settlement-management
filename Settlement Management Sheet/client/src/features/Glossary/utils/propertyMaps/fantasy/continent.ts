const continentPropertyArrayMap = [
  {
    name: 'Geography',
    children: [
      {
        multiple: false,
        keypath: 'climates',
        label: 'Climate',
      },
      {
        multiple: true,
        keypath: 'terrain',
        label: 'Terrain',
      },
      {
        multiple: true,
        keypath: 'regions',
        label: 'Regions',
      },
      {
        multiple: true,
        keypath: 'locations',
        label: 'Locations',
      },
    ],
  },
  {
    name: 'Political',
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
      {
        multiple: true,
        keypath: 'resources',
        label: 'Resources',
      },
    ],
  },
  {
    name: 'History',
    children: [
      {
        multiple: true,
        keypath: 'eventLog',
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
