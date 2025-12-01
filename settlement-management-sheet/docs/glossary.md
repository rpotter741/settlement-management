# Glossary Organization

## What Is The Glossary?

The Glossary is a file-explorer type layout with individual entries split between sections and details, utilizing nodes for shallow data and directory structure. It maintains `integrationState`, which allows custom terms and visibility per property (owner, collaborator, player, resident, public) as well as Palette Settings.

### Nodes

Nodes share an id with their entry, be it a section or detail.

### Sections

Sections are like folders. They follow a sort of tier system, which needs to be written this explicitly so I can just map labels to integers, of 0 - 6. A tier can nest into one larger than it, but not equal to or smaller than. Fantasy, for instance, has Continent (6), Territory (5), Domain (4), Province (3), Landmark (2), Settlement (1), Faction (0).

#### Section SubTypes

Sections can define Sub-Types, enabling them to curate preset configurations of `integrationState`. This allows a Tier 6 (Continent) object to be completely changed, perhaps naming it 'Solar System' with a whole slew of custom properties.

In either case, under the hood it uses the same models (Geography, Politics, Relationships, History, Custom) to track properties. A subtype is most likely going to be a container for `integrationState` and `customFields`.

#### Custom Options

Glossaries (or their sections) contain a list of custom options per keypath. Likely, the custom options will be documented in isolation in their own model with a reference to glossaryId so they can be queried by glossaryId + sectionId (eg, subModel name) + keypath.

They'll define the name as well as `canonicalTag`, so that the `Narrative Interpolation Engine` has fallback even when it's weird options **Note: This is probably only needed for those properties by which name-spacing is supported.**

It'll probably be normalized and work that way anyway, but nothing breaks if some don't have fallbacks.
