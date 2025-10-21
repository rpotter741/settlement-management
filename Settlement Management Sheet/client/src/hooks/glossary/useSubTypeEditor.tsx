import {
  selectActiveId,
  selectSubTypeById,
} from '@/app/selectors/glossarySelectors.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { v4 as newId } from 'uuid';
import addSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/addSubTypePropertyThunk.js';
import addSubTypeGroupThunk from '@/app/thunks/glossary/subtypes/addSubTypeGroupThunk.js';

const useSubTypeEditor = (id: string) => {
  const glossaryId = useSelector(selectActiveId());
  const subType = useSelector(selectSubTypeById(glossaryId || '', id));

  const addGroup = () => {
    addSubTypeGroupThunk({
      glossaryId: glossaryId || '',
      subTypeId: id,
      type: subType?.entryType,
      group: {
        name: 'New Group',
        id: newId(),
        propertyOrder: [],
        propertyData: {},
      },
    });
  };

  const addProperty = (groupId: string) => {
    if (!subType) return;
    const group = subType.groupOrder.find((g: string) => g === groupId);
    if (!group) return;
    const newPropertyId = newId();
    addSubTypePropertyThunk({
      glossaryId: glossaryId || '',
      type: subType.entryType,
      subTypeId: subType.id,
      groupId,
      property: {
        id: newPropertyId,
        name: 'Untitled Property',
        type: 'text',
        value: '',
      },
    });
  };

  return useMemo(
    () => ({ subType, addGroup, addProperty }),
    [subType, addGroup, addProperty]
  );
};

export default useSubTypeEditor;
