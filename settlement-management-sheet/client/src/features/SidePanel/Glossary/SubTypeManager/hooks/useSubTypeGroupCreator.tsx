import { dispatch } from '@/app/constants.js';
import { createDefaultGroup } from '@/app/dispatches/glossary/SubTypePropertyTransformations.js';
import {
  selectSubTypeGroupById,
  selectSubTypeGroups,
} from '@/app/selectors/subTypeSelectors.js';
import { SubTypeGroup } from '@/app/slice/subTypeSlice.js';
import { createSubTypeGroupThunk } from '@/app/thunks/glossary/subtypes/groups/createSubTypeGroupThunk.js';
import fetchSubTypeGroupsThunk from '@/app/thunks/glossary/subtypes/groups/fetchSubTypeGroupsThunk.js';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as newId } from 'uuid';
import useSubTypePropertyCreator from './useSubTypePropertyCreator.js';

const useSubTypeGroupCreator = ({
  activeGroup,
  setActiveGroup,
  openRelay,
}: {
  activeGroup: string | null;
  setActiveGroup: (groupId: string | null) => void;
  openRelay: ({
    data,
    status,
  }: {
    data: any;
    status: 'complete' | 'pending';
  }) => void;
}) => {
  // searching
  const [searchTerm, setSearchTerm] = useState('');

  // content type anchors
  const [contentAnchor, setContentAnchor] = useState<null | HTMLElement>(null);
  const [contentFilters, setContentFilters] = useState<('SYSTEM' | 'CUSTOM')[]>(
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

  // get them groups
  // dispatch(fetchSubTypeGroupsThunk());
  const groups = useSelector(selectSubTypeGroups);

  const group = useSelector(
    selectSubTypeGroupById({ groupId: activeGroup || '' })
  );

  const allGroups = useMemo(() => {
    return groups
      .filter((group) => {
        const matchesSearch = group.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesContentType =
          contentFilters.length === 0 ||
          (contentFilters.includes('SYSTEM') &&
            group.contentType === 'SYSTEM') ||
          (contentFilters.includes('CUSTOM') && group.contentType === 'CUSTOM');

        return matchesSearch && matchesContentType;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [groups, searchTerm, contentFilters]);

  const addGroup = (name: string) => {
    const id = newId();
    const group = createDefaultGroup(name, id);
    dispatch(createSubTypeGroupThunk({ group }));
  };

  const handleGroupClick = (groupId: string | null) => {
    setActiveGroup(groupId);
    openRelay({
      data: {
        setActiveGroup: groupId,
      },
      status: 'complete',
    });
  };

  // property management within groups
  const { allProperties } = useSubTypePropertyCreator();
  const availableProperties = useMemo(() => {
    if (!activeGroup) return [];
    if (!group) return [];
    const assignedPropertyIds = group.properties
      ? group.properties.map((p) => p.propertyId)
      : [];
    return allProperties.filter(
      (property) => !assignedPropertyIds.includes(property.id)
    );
  }, [activeGroup, allProperties, group]);

  const [searchProperties, setSearchProperties] = useState('');

  const filteredAvailableProperties = useMemo(() => {
    return availableProperties.filter((property) =>
      property.name.toLowerCase().includes(searchProperties.toLowerCase())
    );
  }, [availableProperties, searchProperties, activeGroup]);

  return {
    searchTerm,
    setSearchTerm,
    contentAnchor,
    contentFilters,
    handleMenu,
    closeMenu,
    addGroup,
    handleGroupClick,
    allGroups,
    activeGroup,
    availableProperties,
    searchProperties,
    setSearchProperties,
    filteredAvailableProperties,
  };
};

export default useSubTypeGroupCreator;
