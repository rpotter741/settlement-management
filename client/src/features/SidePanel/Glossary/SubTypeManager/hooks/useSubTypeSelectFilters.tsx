import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlossaryEntryType } from '../../../../../../../shared/types/index.js';

const useSubTypeSelectFilters = (
  editId: string | null,
  onSubmit: (subType: any) => void
) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [typeAnchor, setTypeAnchor] = useState<null | HTMLElement>(null);
  const [typeFilters, setTypeFilters] = useState<GlossaryEntryType[]>([]);
  const [typeSort, setTypeSort] = useState<'asc' | 'desc' | null>(null);

  const [nameAnchor, setNameAnchor] = useState<null | HTMLElement>(null);
  const [nameSort, setNameSort] = useState<'asc' | 'desc' | null>(null);

  const [contentAnchor, setContentAnchor] = useState<null | HTMLElement>(null);
  const [contentFilters, setContentFilters] = useState<string[]>([]);
  const [contentSort, setContentSort] = useState<'asc' | 'desc' | null>(null);

  const handleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: 'type' | 'name' | 'content'
  ) => {
    event.preventDefault();
    switch (type) {
      case 'type':
        setTypeAnchor(event.currentTarget);
        break;
      case 'name':
        setNameAnchor(event.currentTarget);
        break;
      case 'content':
        setContentAnchor(event.currentTarget);
        break;
    }
  };

  const closeMenu = () => {
    setTypeAnchor(null);
    setNameAnchor(null);
    setContentAnchor(null);
  };

  const allSubTypes = useSelector(selectAllSubTypes);

  const allSubTypeIds = useRef(allSubTypes.map((st) => st.id));

  useEffect(() => {
    if (allSubTypeIds.current.length > 0) {
      const diff = allSubTypes.length - allSubTypeIds.current.length;
      if (diff === 1) {
        const newSubType = [...allSubTypes].filter(
          (st) => !allSubTypeIds.current.includes(st.id)
        )[0];
        onSubmit(newSubType);
        allSubTypeIds.current = allSubTypes.map((st) => st.id);
      }
    }
  }, [allSubTypes, editId]);

  const filteredSubTypes = useMemo(() => {
    if (!allSubTypes) return [];

    const filtered = allSubTypes.filter((subType) => {
      const matchesSearchTerm =
        subType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subType.entryType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTypeFilter =
        typeFilters.length === 0 || typeFilters.includes(subType.entryType);

      const matchesContentTypeFilter =
        contentFilters.length === 0 ||
        contentFilters.includes(subType.contentType);

      return matchesSearchTerm && matchesTypeFilter && matchesContentTypeFilter;
    });

    const sorted = [...filtered].sort((a, b) => {
      // Multi-sort priority: Type first, then Name
      const sortOrder = [];

      if (typeSort) {
        sortOrder.push({
          key: 'entryType',
          direction: typeSort,
          locale: true,
        });
      }

      if (nameSort) {
        sortOrder.push({
          key: 'name',
          direction: nameSort,
          locale: true,
        });
      }

      if (contentSort) {
        sortOrder.push({
          key: 'contentType',
          direction: contentSort,
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

        if (result !== 0) {
          return direction === 'desc' ? -result : result;
        }
      }

      return 0;
    });

    return sorted;
  }, [
    allSubTypes,
    searchTerm,
    typeFilters,
    contentFilters,
    typeSort,
    nameSort,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    typeAnchor,
    handleMenu,
    typeFilters,
    setTypeFilters,
    typeSort,
    setTypeSort,
    nameAnchor,
    nameSort,
    setNameSort,
    contentAnchor,
    contentFilters,
    setContentFilters,
    filteredSubTypes,
    closeMenu,
    contentSort,
    setContentSort,
  };
};

export default useSubTypeSelectFilters;
