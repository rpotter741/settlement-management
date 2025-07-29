import { geographySchema } from './glossary/geographySchema';
import { nameSchema } from './generic/nameSchema';
import { descriptionSchema } from './generic/descriptionSchema';
import { iconSchema } from './generic/iconSchema';

export type SchemaMapTools =
  | 'glossary'
  | 'attribute'
  | 'category'
  | 'event'
  | 'apt'
  | 'action'
  | 'building'
  | 'upgrade'
  | 'kit'
  | 'listener'
  | 'settlementType'
  | 'settlement'
  | 'gameStatus'
  | 'storyThread'
  | 'tradeHub';

export type SchemaMapType = Record<SchemaMapTools, Record<string, unknown>>;

export const schemaMap: SchemaMapType = {
  glossary: {
    geography: geographySchema,
    history: {},
    political: {},
    relationships: {},
    section: {},
    custom: {},
    location: {},
    person: {},
    event: {},
    note: {},
  },
  attribute: {
    name: nameSchema,
    description: descriptionSchema,
    icon: iconSchema,
  },
  category: {},
  event: {},
  apt: {},
  action: {},
  building: {},
  upgrade: {},
  kit: {},
  listener: {},
  settlementType: {},
  settlement: {},
  gameStatus: {},
  storyThread: {},
  tradeHub: {},
};

export default schemaMap;
