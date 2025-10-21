import { property } from 'lodash';
import { v4 as newId } from 'uuid';
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
  const overviewId = newId();
  const descriptionId = newId();
  const subType = {
    id,
    refId: newId(),
    version: 1,
    updatedAt: new Date().toISOString(),
    forkedBy: null,
    collaborators: [],
    editors: [],
    deletedAt: null,
    isImmutable: true,
    name,
    entryType: entryType,
    groupOrder: [overviewId],
    groupData: {
      [overviewId]: {
        id: overviewId,
        name: 'Overview',
        subTypeId: id,
        propertyOrder: [descriptionId],
        propertyData: {
          [descriptionId]: {
            name: 'Description',
            type: 'text',
            inputType: 'richtext',
            value: '',
          },
        },
        updatedAt: new Date().toISOString(),
      },
    },
    anchors: {
      primary: null,
      secondary: null,
    },
  };
  return { id, subType };
};

export default makeNewSubType;
