import { Box, IconButton, TextField, Typography } from '@mui/material';
import CreateNewButton from './components/CreateNewButton.js';
import useSubTypeGroupCreator from './hooks/useSubTypeGroupCreator.js';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { ArrowBack, Close } from '@mui/icons-material';
import SidebarProperty from './components/SidebarProperty.js';
import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import SidebarGroup from './components/SidebarGroup.js';
import { SortableContext } from '@dnd-kit/sortable';
import {
  DragOverlay,
  useDndContext,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import DragPreview from '@/context/DnD/preview/DragPreview.tsx';

const SubTypeGroupCreator = ({
  openRelay,
  activeGroup,
  setActiveGroup,
}: {
  openRelay: ({
    data,
    status,
  }: {
    data: any;
    status: 'complete' | 'pending';
  }) => void;
  activeGroup: string | null;
  setActiveGroup: (groupId: string | null) => void;
}) => {
  const {
    searchTerm,
    setSearchTerm,
    addGroup,
    allGroups,
    handleGroupClick,
    filteredAvailableProperties,
    searchProperties,
    setSearchProperties,
  } = useSubTypeGroupCreator({ activeGroup, setActiveGroup, openRelay });
  const { active } = useDndContext();

  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <AnimatePresence mode="popLayout">
      <MotionBox
        key="subtype-group-creator-box"
        layout
        layoutId="subtype-group-creator-box"
        animate={{
          opacity: 1,
          scaleY: activeGroup === null ? 1 : 0,
          height: activeGroup === null ? 'auto' : 0,
        }}
        exit={{ opacity: 0, scaleY: 0, height: 0 }}
        transition={{ duration: 0.33 }}
      >
        <CreateNewButton
          onAdd={addGroup}
          selectOptions={[]}
          label="Add Group"
        />
        <TextField
          sx={{ my: 2 }}
          fullWidth
          size="small"
          placeholder="Search Groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton onClick={() => setSearchTerm('')}>
                  <Close />
                </IconButton>
              ),
            },
          }}
        />
      </MotionBox>
      <MotionBox
        key="subtype-group-list-box"
        layoutId="subtype-group-list-box"
        layout
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          maxHeight: 'calc(100vh - 280px)',
          overflowY: 'auto',
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.33 }}
        sx={{}}
      >
        {!activeGroup &&
          allGroups.map((group) => (
            <SidebarGroup
              key={group.id}
              index={allGroups.indexOf(group)}
              handleGroupClick={handleGroupClick}
              groupId={group.id}
              hoverIndex={-1}
              setHoverIndex={() => {}}
              handleGroupReorder={() => {}}
              isActive={activeGroup === group.id}
              handleGroupDeletion={() => {}}
            />
          ))}
        <MotionBox
          key="property_list_box"
          layout
          layoutId="property_list_box"
          initial={{ opacity: 0 }}
          animate={{
            opacity: activeGroup ? 1 : 0,
          }}
          transition={{ duration: 0.4 }}
          sx={{ py: 0, height: '70vh', overflowY: 'auto' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              pt: 2,
            }}
          >
            <Typography variant="h6">Available Properties</Typography>
            <IconButton
              sx={{ position: 'absolute', left: 0 }}
              onClick={() => {
                handleGroupClick(null);
                openRelay({
                  data: {
                    setActiveGroup: null,
                  },
                  status: 'complete',
                });
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Properties..."
            value={searchProperties}
            onChange={(e) => setSearchProperties(e.target.value)}
            sx={{ my: 1 }}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton onClick={() => setSearchProperties('')}>
                    <Close />
                  </IconButton>
                ),
              },
            }}
          />
          <SortableContext items={filteredAvailableProperties.map((p) => p.id)}>
            {filteredAvailableProperties.map((property, index) => (
              <SidebarProperty
                key={property.id}
                index={index}
                handlePropertyClick={() => {}}
                propertyId={property.id}
              />
            ))}
            <DragPreview>
              {/* Overlay content can be added here if needed */}
              {active ? (
                <SidebarProperty
                  key={active.id.toString()}
                  index={0}
                  handlePropertyClick={() => {}}
                  propertyId={active.id.toString()}
                />
              ) : null}
            </DragPreview>
          </SortableContext>
        </MotionBox>
      </MotionBox>
    </AnimatePresence>
  );
};

export default SubTypeGroupCreator;
