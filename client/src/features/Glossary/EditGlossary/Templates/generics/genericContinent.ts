import { property } from 'lodash';
import { ulid as newId } from 'ulid';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';

export type SubTypePropertyTypes =
  | 'text'
  | 'date'
  | 'dropdown'
  | 'checkbox'
  | 'range'
  | 'compound';

const subTypePropertyTypes: SubTypePropertyTypes[] = [
  'text',
  'date',
  'dropdown',
  'checkbox',
  'range',
  'compound',
];

export { subTypePropertyTypes };

const makeNewSubType = (name: string, entryType: GlossaryEntryType) => {
  const id = newId();
  const subType = {
    id,
    refId: newId(),
    version: 1,
    forkedBy: null,
    collaborators: [],
    editors: [],
    name,
    entryType: entryType,
    anchors: {
      primary: null,
      secondary: null,
    },
  };

  return { id, subType };
};

export default makeNewSubType;
