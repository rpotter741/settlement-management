const glossaryModelPropertyMap = {
  location: {
    tags: [],
    locationType: [],
    regions: [],
    occupants: [],
    nearbyFeatures: {},
    events: [],
  },
  person: {
    tags: [],
    occupations: [],
    titles: [],
    traits: [],
    factions: [],
    locations: [],
    relationships: {},
    notoriety: '',
  },
  note: {
    version: 1,
    description: '',
    dataString: '',
    noteType: '',
    priority: 'low',
    dueDate: '',
    relatedEntries: {},
    tags: [],
    isArchived: false,
    isPinned: false,
    isShared: false,
    sharedWith: [],
    attachments: {},
  },
  event: {
    tags: [],
    significance: 'trivial',
    gameDate: '',
    frequency: 'annual',
    locations: [],
    relatedEntries: [],
  },
  section: {
    tags: [],
    integrationState: {},
  },
};

export default glossaryModelPropertyMap;
