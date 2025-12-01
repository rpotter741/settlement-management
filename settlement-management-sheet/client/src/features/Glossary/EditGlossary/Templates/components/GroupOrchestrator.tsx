import { dispatch } from '@/app/constants.js';
import {
  addPropertyToGroup,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import NameEditor from '@/components/shared/DynamicForm/NameEditor.js';
import TermEditor from '@/components/shared/DynamicForm/TermEditor.js';
import { propertyTypeIconMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import useGlobalDrag from '@/hooks/global/useGlobalDrag.js';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SubTypeFormPreview from './previews/SubTypeFormPreview.js';
import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import { addPropertyToGroupThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyToGroupThunk.js';
import { useSelector } from 'react-redux';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { Delete, DragHandle } from '@mui/icons-material';
import { removeGroupPropertyThunk } from '@/app/thunks/glossary/subtypes/groups/removeGroupPropertyThunk.js';
import DraggablePropertyEntry from './DnD/DraggablePropertyEntry.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { reorderGroupPropertiesThunk } from '@/app/thunks/glossary/subtypes/groups/reorderGroupPropertiesThunk.js';
import { cloneDeep } from 'lodash';
import { updateSubTypeGroupThunk } from '@/app/thunks/glossary/subtypes/groups/updateSubTypeGroupThunk.js';
import { deleteSubTypeGroupThunk } from '@/app/thunks/glossary/subtypes/groups/deleteSubTypeGroupThunk.js';
import useDebouncedFieldEdit from '@/hooks/global/useDebouncedFieldEdit.js';
import useGlobalDragUI from '@/hooks/global/useGlobalDragUI.js';

const GroupOrchestrator = ({
  group,
  deselectGroup,
}: {
  group: SubTypeGroup;
  deselectGroup: () => void;
}) => {
  const allProperties = useSelector(selectSubTypeProperties);

  const { getAlphaColor, lightenColor } = useTheming();

  // state for form preview
  const [localPreview, setLocalPreview] = useState(false);

  //dnd interaction stuff
  const { hoverIndex, setHoverIndex } = useGlobalDragUI();

  const { value: descriptionValue, handleChange: handleDescriptionChange } =
    useDebouncedFieldEdit({
      source: group.description || '',
      updateFn: (value: string) => {
        dispatch(
          updateSubTypeGroupThunk({
            groupId: group.id,
            updates: { description: value },
          })
        );
      },
      deps: [group.description, group.id],
    });

  //function to update width of a property in the group display settings
  const updateWidth = (propertyId: string, width: number) => {
    const newDisplay = cloneDeep(group.display || {});
    newDisplay[propertyId] = {
      ...(newDisplay[propertyId] || {}),
      columns: width,
    };
    dispatch(
      updateSubTypeGroupThunk({
        groupId: group.id,
        updates: {
          display: newDisplay,
        },
      })
    );
  };

  const { ref, matchesDragType, draggedType, isDragging } = useGlobalDrag({
    types: ['subtype-property', 'subtype-group-property'],
    interaction: 'drop',
    onDrop: (item) => {
      if (draggedType === 'subtype-property') {
        dispatch(
          addPropertyToGroupThunk({
            groupId: group.id,
            propertyId: item.id,
          })
        );
      } else if (draggedType === 'subtype-group-property') {
        //reordering within group handled in DraggablePropertyEntry
        const order = group?.properties.length || 0;
        const newOrder = [...group.properties].map((p) => p.propertyId);
        newOrder.splice(item.index, 1);
        newOrder.splice(order, 0, item.id);
        dispatch(
          reorderGroupPropertiesThunk({
            groupId: group.id,
            newOrder: newOrder,
          })
        );
      }
    },
    onHover: (item) => {
      setHoverIndex(group.properties.length);
    },
    index: group.properties ? group.properties.length : 0,
  });

  // clear hover index when not dragging
  useEffect(() => {
    if (!isDragging && hoverIndex !== null) {
      setHoverIndex(null);
    }
  }, [isDragging, hoverIndex]);

  if (localPreview) {
    return (
      <>
        <Button
          variant="contained"
          sx={{ mt: 4, maxWidth: 750 }}
          onClick={() => setLocalPreview(false)}
          color="secondary"
          fullWidth
        >
          Return to List View
        </Button>
        <PageBox
          mode="edit"
          variant="default"
          outerStyle={{ height: '100%' }}
          innerStyle={{ paddingTop: 8 }}
        >
          <SubTypeFormPreview
            glossaryId={null}
            mode="group"
            group={group}
            source={{}}
            liveEdit={false}
            onAddData={() => {}}
            handleChange={() => {}}
            onRemove={() => {}}
          />
        </PageBox>
      </>
    );
  }

  return (
    <Box
      sx={{
        mt: 4,
        px: 4,
        maxWidth: 800,
        height: '100%',
        minWidth: 765,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          position: 'relative',
          my: 2,
        }}
      >
        <Typography sx={{ fontSize: '1.2rem', width: 125, textAlign: 'start' }}>
          Name:
        </Typography>
        <NameEditor
          defaultValue={group.name}
          handleSave={(newValue) => {
            if (group.name === newValue) return;
            dispatch(
              updateSubTypeGroupThunk({
                groupId: group.id,
                updates: { name: newValue },
              })
            );
          }}
        />
        <Button
          sx={{ position: 'absolute', right: 0 }}
          color="error"
          variant="contained"
          onClick={() => {
            deselectGroup();
            // add logic to delete subtype via model with relationships counts
            dispatch(
              deleteSubTypeGroupThunk({
                groupId: group.id,
              })
            );
          }}
        >
          Delete Group
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'start',
          position: 'relative',
          my: 2,
        }}
      >
        <Typography sx={{ fontSize: '1.1rem', width: 125 }}>
          Display Name:
        </Typography>
        <NameEditor
          defaultValue={group.displayName || group.name}
          handleSave={(newValue) => {
            if (group.displayName === newValue) return;
            dispatch(
              updateSubTypeGroupThunk({
                groupId: group.id,
                updates: { displayName: newValue },
              })
            );
          }}
          fontSize="1.1rem"
        />
      </Box>
      <TextField
        sx={{ mt: 2 }}
        fullWidth
        placeholder="Enter a description..."
        size="small"
        value={descriptionValue}
        multiline
        rows={4}
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        onChange={(e) => handleDescriptionChange(e.target.value)}
      />
      {/* <Button
        fullWidth
        variant="contained"
        color="secondary"
        onClick={() => setLocalPreview(true)}
        sx={{ my: 2 }}
      >
        Edit Group Appearance
      </Button> */}

      <Typography variant="h6" sx={{ my: 2 }}>
        Properties
      </Typography>

      {group.properties &&
        group.properties.map((propertyLink, index) => {
          const property = allProperties.find(
            (p) => p.id === propertyLink.propertyId
          );
          if (!property) return null;
          return (
            <DraggablePropertyEntry
              key={property.id}
              property={property}
              group={group}
              index={index}
              hoverIndex={hoverIndex}
              setHoverIndex={setHoverIndex}
              updateWidth={updateWidth}
              columnSize={group.display?.[property.id]?.columns || 4}
            />
          );
        })}
      {group.properties.length < 10 && (
        <Box
          sx={{
            height: '45px',
            width: '100%',
            mt: 2,
            border: 1,
            borderColor: matchesDragType ? 'primary.main' : 'transparent',
            borderStyle: 'dashed',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              hoverIndex === group.properties.length
                ? getAlphaColor({
                    color: 'success',
                    key: 'light',
                    opacity: 0.3,
                  })
                : 'transparent',
          }}
          ref={ref}
        />
      )}
    </Box>
  );
};

export default GroupOrchestrator;
