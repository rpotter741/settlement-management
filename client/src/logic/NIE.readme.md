# Narrative Interpolation Engine

## How

Capture an event's namespacing via a configuration object attached to the event. Here's the gist:

```typescript
type NIETypes =
  | 'continent'
  | 'region'
  | 'nation'
  | 'region'
  | 'landmark'
  | 'settlement'
  | 'collective'
  | 'person'
  | 'location'
  | 'event'
  | 'note'
  | 'item';

type NIESubTypes = string;

type SemanticAnchors = { property: string; value: string };

type EventSeverities = 'trivial' | 'low' | 'moderate' | 'major' | 'significant';

interface InterpolationObj {
  ref: string;
  keypath: string; // where to look on the entry for interpolation -- pretty much always name, but we're versatile!
  type: NIETypes;
  subType: NIESubTypes;
  semanticAnchor: SemanticAnchors[];
  [key: string]: any; //for expansion!
}

type FlavorText = Record<EventSeverities, InterpolationObj[]>;

interface NIEConfig {
  title: InterpolationObj[];
  description: InterpolationObj[];
  flavorText: FlavorText;
}

//standard event example:
const standardEvent: {
  title: 'Fire in [[Skywood]]';
  description: 'A wildfire has broken out along the edge of the [[Wickwood Cliffs]], wrecking trade routes with [[Nilvalari]].';
  flavorText: null;
};

// standard nie config example:
const nieStandardConfig: NIEConfig = {
  title: [
    {
      ref: 'Skywood',
      keypath: 'name',
      type: 'landmark',
      subType: 'Forest',
      semanticAnchors: [
        {
          property: 'climate',
          value: 'temperate',
        },
      ],
    },
  ],
  description: [
    {
      ref: 'Wickwood Cliffs',
      keypath: 'name',
      type: 'landmark',
      subType: 'Mountains',
      semanticAnchors: [
        {
          property: 'terrain',
          value: 'cliffs',
        },
      ],
    },
    {
      ref: 'Nilvalari',
      keypath: 'name',
      type: 'settlement',
      subType: 'Village',
      semanticAnchors: [
        {
          property: 'population',
          value: '<= 1000',
        },
      ],
    },
  ],
};
```

Now, when User B installs User A's 'Fire in Skywood' event, the NIE can use the event's configuration object to find matches to their own world.

## Event Localization

Localization occurs by parsing the object and compiling possible matches for the event. To that end, a resolver function will map over the glossary's nodes and compile and object with three temporary arrays. The `semanticAnchor` array is reserved for only those entries who have at least one match to the `nieCofig` semanticAnchors array.

Of note, `GlossaryNode` interface includes semanticAnchor data for the entry, since each `subType` can have a maximum of two (2) `semanticAnchor`s.

```typescript
  interface ResolverObj {
    type: GlossaryNode[];
    subType: GlossaryNode[];
    semanticAnchor: GlossaryNode[];
  }

  const resolverObj: ResolverObj = {
    type: [...],
    subType: [...],
    semanticAnchor: [...],
  }
```

Once the arrays a built, the resolver sorts `semanticAnchor` by those with the most matches. Once sorted, it automatically fills in the event description / title / flavor text with the identified entries and their respective data. In the event of a tie, the resolver randomly selects an entry from those that meet all criteria. **This is the preferred method since it precludes an API call and is the closest to the original author's intent.**

In the event there are no `semanticAnchor` matches, then it falls back to `subType`. Here, it pulls information from the provided keypath as normal with potential for more drift from the original author's intent. If no matches, it reverts to `type`.

`type` is a little trickier since `subType`s deal with field manipulation. If it falls back to `type`, it will look for any matches to the provided keypath. Both `type` and `subType` resolutions require an API call to get data and, in the event no matches are found, it will revert to a type-derived fallback.

In the event there are no type matches, the fallback will revert to a fallback map, using the `nieConfig` type definition to resolve.

**Of note, when a user installs an event pack, a list of NIE Configs is checked (locally and in the background) against the user's glossary. If any of the `nieConfig` objects have an empty `semanticAnchor` array, then the user will be notified of failure to reconcile and prompt them to create a new entry that 'checks all the boxes', as it were.**

## Rendering Resolutions

All NIE recommendations are surfaced to the DM prior to an event being surfaced to a player. The `resolverObj` is stored in memory until the event is pushed so that the DM can edit any `ref` with other options from the `resolverObj`.

Alternatively, `resolverObj`s could be mapped in the background upon login. This would allow near-instant localization both during play and in the marketplace.

In any case, a huge bonus to this approach: _it can and will scale gracefully_. The resolver could be extended for virtually anything: adjectives, pronouns, weighting, counter-weights by semanticAnchor relationships, the list goes on because the scaffolding is in place.
