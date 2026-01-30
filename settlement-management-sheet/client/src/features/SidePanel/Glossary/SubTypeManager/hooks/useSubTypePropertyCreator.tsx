import { dispatch } from '@/app/constants.js';
import { createDefaultProperty } from '@/app/dispatches/glossary/SubTypePropertyTransformations.js';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { addSubTypePropertyThunkRoot } from '@/app/thunks/glossary/subtypes/properties/addSubTypePropertyThunk.js';
import fetchSubTypePropertiesThunk from '@/app/thunks/glossary/subtypes/properties/fetchSubTypePropertiesThunk.js';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ulid as newId } from 'ulid';

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

  // property type
  const [typeAnchor, setTypeAnchor] = useState<null | HTMLElement>(null);
  const [typeFilters, setTypeFilters] = useState<SubtypePropertyTypes[]>([]);
  const [typeSort, setTypeSort] = useState<'asc' | 'desc' | null>(null);

  // content type
  const [contentAnchor, setContentAnchor] = useState<null | HTMLElement>(null);
  const [contentFilters, setContentFilters] = useState<('system' | 'custom')[]>(
    []
  );

  // relationship filter
  const [relationshipFilter, setRelationshipFilter] = useState<
    true | false | null
  >(null);

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
  // dispatch(fetchSubTypePropertiesThunk());
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

  // filtering properties
  const filteredProperties = useMemo(() => {
    if (!allProperties) return [];

    const filtered = allProperties.filter((property) => {
      const matchesSearchTerm =
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.inputType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTypeFilter =
        typeFilters.length === 0 ||
        typeFilters.includes(property.inputType as SubtypePropertyTypes);

      const matchesContentTypeFilter =
        contentFilters.length === 0 ||
        contentFilters.includes(property.contentType);

      const matchesRelationshipFilter =
        relationshipFilter === null ||
        (relationshipFilter === true && property.shape.relationship) ||
        (relationshipFilter === false && !property.shape.relationship) ||
        (property.inputType === 'compound' &&
          //@ts-ignore
          property.shape?.left?.shape?.relationship) ||
        (property.inputType === 'compound' &&
          //@ts-ignore
          property.shape?.right?.shape?.relationship);

      return (
        matchesSearchTerm &&
        matchesTypeFilter &&
        matchesContentTypeFilter &&
        matchesRelationshipFilter
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const sortOrder = [];

      if (typeSort) {
        sortOrder.push({
          key: 'inputType',
          direction: typeSort,
          locale: true,
        });
      }

      for (const { key, direction, locale } of sortOrder) {
        let result = 0;

        if (locale) {
          result = a[key].localeCompare(b[key], undefined, {
            sensitivity: 'base',
          });
        } else {
          result = a[key] - b[key];
        }

        if (result === 0) {
          return direction === 'desc' ? -result : result;
        }
      }
      return 0;
    });

    return sorted;
  }, [allProperties, searchTerm, typeFilters, contentFilters, typeSort]);

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
  const handlePropertyClick = (propertyId: string) => {};

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
    filteredProperties,
    addProperty,
    handlePropertyClick,
    relationshipFilter,
    setRelationshipFilter,
  };
};

export default useSubTypePropertyCreator;
