import { dispatch } from '@/app/constants.js';
import {
  selectAllSubTypes,
  selectSubTypeById,
  selectSubTypeGroups,
} from '@/app/selectors/subTypeSelectors.js';
import fetchSubTypesByUserIdThunk from '@/app/thunks/glossary/subtypes/fetchSubTypesByUserIdThunk.js';
import fetchSubTypeGroupsThunk from '@/app/thunks/glossary/subtypes/groups/fetchSubTypeGroupsThunk.js';
import useGlobalDragUI from '@/hooks/global/useGlobalDragUI.js';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const useSubTypeCreator = ({
  editId,
  setEditId,
}: {
  editId: string | null;
  setEditId: (id: string | null) => void;
}) => {
  //subtype selector
  const subtype = useSelector(selectSubTypeById(editId ?? ''));

  //DnD stuff
  const { hoverIndex, setHoverIndex, hoverColor } = useGlobalDragUI();

  // searching
  const [searchTerm, setSearchTerm] = useState('');

  // content type anchors
  const [contentAnchor, setContentAnchor] = useState<null | HTMLElement>(null);
  const [contentFilters, setContentFilters] = useState<('system' | 'custom')[]>(
    []
  );

  const handleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: 'content'
  ) => {
    event.preventDefault();
    switch (type) {
      case 'content':
        setContentAnchor(event.currentTarget);
        break;
    }
  };

  const closeMenu = () => {
    setContentAnchor(null);
  };

  dispatch(fetchSubTypesByUserIdThunk()); // subtypes
  dispatch(fetchSubTypeGroupsThunk()); // groups
  const allSubTypes = useSelector(selectAllSubTypes);
  const allGroups = useSelector(selectSubTypeGroups);

  const filteredGroups = useMemo(() => {
    const firstFilter = allGroups.filter((group) => {
      const matchesSearch = group.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesContentType =
        contentFilters.length === 0 ||
        (contentFilters.includes('system') && group.contentType === 'system') ||
        (contentFilters.includes('custom') && group.contentType === 'custom');

      return matchesSearch && matchesContentType;
    });
    if (subtype) {
      return firstFilter.filter(
        (group) =>
          !subtype.groups?.some(
            (g: { groupId: string }) => g.groupId === group.id
          )
      );
    }
    return firstFilter;
  }, [allGroups, searchTerm, contentFilters, subtype]);

  return {
    allSubTypes,
    searchTerm,
    filteredGroups,
    setSearchTerm,
    contentAnchor,
    contentFilters,
    setContentFilters,
    handleMenu,
    closeMenu,
    hoverIndex,
    setHoverIndex,
    hoverColor,
  };
};

export default useSubTypeCreator;
