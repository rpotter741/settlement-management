import { dispatch } from '@/app/constants.js';
import { createDefaultProperty } from '@/app/dispatches/glossary/SubTypePropertyTransformations.js';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { addSubTypePropertyThunkRoot } from '@/app/thunks/glossary/subtypes/properties/addSubTypePropertyThunk.js';
import fetchSubTypePropertiesThunk from '@/app/thunks/glossary/subtypes/properties/fetchSubTypePropertiesThunk.js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as newId } from 'uuid';

export type SubtypePropertyTypes =
  | 'text'
  | 'date'
  | 'checkbox'
  | 'range'
  | 'dropdown'
  | 'compound';

export const SubTypePropertyTypeOptions: SubtypePropertyTypes[] = [
  'text',
  'date',
  'checkbox',
  'range',
  'dropdown',
  'compound',
];

const useSubTypePropertyCreator = () => {
  // searching
  const [searchTerm, setSearchTerm] = useState('');

  // property type anchors
  const [typeAnchor, setTypeAnchor] = useState<null | HTMLElement>(null);
  const [typeFilters, setTypeFilters] = useState<SubtypePropertyTypes[]>([]);
  const [typeSort, setTypeSort] = useState<'asc' | 'desc' | null>(null);

  // content type anchors
  const [contentAnchor, setContentAnchor] = useState<null | HTMLElement>(null);
  const [contentFilters, setContentFilters] = useState<('system' | 'custom')[]>(
    []
  );

  const handleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: 'type' | 'content'
  ) => {
    event.preventDefault();
    switch (type) {
      case 'type':
        setTypeAnchor(event.currentTarget);
        break;
      case 'content':
        setContentAnchor(event.currentTarget);
        break;
    }
  };

  const closeMenu = () => {
    setTypeAnchor(null);
    setContentAnchor(null);
  };

  // get them properties
  dispatch(fetchSubTypePropertiesThunk());
  const properties = useSelector(selectSubTypeProperties);
  const allProperties = properties
    .filter((property) => {
      const matchesSearchTerm = property.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTypeFilter = property.inputType
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesSearchTerm || matchesTypeFilter;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  //adding a property
  const addProperty = (name: string, type: SubtypePropertyTypes) => {
    const id = newId();
    const property = createDefaultProperty(type, name, id)!;
    dispatch(
      addSubTypePropertyThunkRoot({
        property,
      })
    );
  };

  // click handlers
  const handlePropertyClick = (propertyId: string) => {
    console.log('Clicked property with ID:', propertyId);
  };

  return {
    searchTerm,
    setSearchTerm,
    typeAnchor,
    typeFilters,
    setTypeFilters,
    typeSort,
    setTypeSort,
    contentAnchor,
    contentFilters,
    setContentFilters,
    handleMenu,
    closeMenu,
    allProperties,
    addProperty,
    handlePropertyClick,
  };
};

export default useSubTypePropertyCreator;
