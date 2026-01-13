import { selectSubTypeById } from '@/app/selectors/subTypeSelectors.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { v4 as newId } from 'uuid';
import addSubTypePropertyThunk from '@/app/thunks/glossary/subtypes/addSubTypePropertyThunk.js';
import addSubTypeGroupThunk from '@/app/thunks/glossary/subtypes/addSubTypeGroupThunk.js';

const useSubTypeEditor = (id: string) => {
  const subType = useSelector(selectSubTypeById(id));

  const addGroup = () => {
    addSubTypeGroupThunk({
      subTypeId: id,
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
