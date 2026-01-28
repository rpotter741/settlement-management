import { dispatch } from '@/app/constants.js';
import {
  addPropertyToGroup,
  SubTypeGroup,
  SubTypeProperty,
} from '@/app/slice/subTypeSlice.js';
import NameEditor from '@/components/shared/DynamicForm/NameEditor.js';
import TermEditor from '@/components/shared/DynamicForm/TermEditor.js';
import { propertyTypeIconMap } from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.js';
import useGlobalDrag from '@/hooks/global/useGlobalDragKit.tsx';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import SubTypeFormPreview from './previews/SubTypeFormPreview.js';
import PageBox from '@/components/shared/Layout/PageBox/PageBox.js';
import { addPropertyToGroupThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyToGroupThunk.js';
import { useSelector } from 'react-redux';
import { selectSubTypeProperties } from '@/app/selectors/subTypeSelectors.js';
import { Delete, DragHandle } from '@mui/icons-material';
import { removeGroupPropertyThunk } from '@/app/thunks/glossary/subtypes/groups/removeGroupPropertyThunk.js';
import DraggablePropertyEntry from './DnD/DraggablePropertyEntry.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { cloneDeep } from 'lodash';
import { updateSubTypeGroupThunk } from '@/app/thunks/glossary/subtypes/groups/updateSubTypeGroupThunk.js';
import { deleteSubTypeGroupThunk } from '@/app/thunks/glossary/subtypes/groups/deleteSubTypeGroupThunk.js';
import useDebouncedFieldEdit from '@/hooks/global/useDebouncedFieldEdit.js';
import useGlobalDragUI from '@/hooks/global/useGlobalDragUI.js';
import { SortableContext } from '@dnd-kit/sortable';

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

  const { ref, canAccept, isOver } = useGlobalDrag({
    id: group.id,
    dropType: 'subtype-group',
    types: ['subtype-property', 'subtype-group-property'],
    interaction: 'drop',
    index: group.properties ? group.properties.length : 0,
  });

  // // clear hover index when not dragging
  // useEffect(() => {
  //   if (!isDragging && hoverIndex !== null) {
  //     setHoverIndex(null);
  //   }
  // }, [isDragging, hoverIndex]);

  const sortedProperties = useMemo(() => {
    return cloneDeep(group.properties).sort((a, b) => {
      return a.order - b.order;
    });
  }, [group.properties]);

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

      <SortableContext items={sortedProperties.map((p) => p.propertyId)}>
        <Box sx={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
          {group.properties &&
            sortedProperties.map((propertyLink, index) => {
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
        </Box>

        {group.properties.length < 10 && (
          <Box
            sx={{
              height: '45px',
              width: '100%',
              mt: 2,
              border: 1,
              borderColor: canAccept ? 'primary.main' : 'transparent',
              borderStyle: 'dashed',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isOver
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
      </SortableContext>
    </Box>
  );
};

export default GroupOrchestrator;

/*
Straight answer, no poetry:

Anchors are the compression layer between human meaning and machine action.

That’s their function.

Everything else is downstream.

⸻

What Anchors Do (Mechanically)

Anchors take a concept that is:
	•	Vague
	•	Qualitative
	•	Narrative-loaded

…and collapse it into:
	•	A small, ordered set of values
	•	With predictable consequences
	•	That can be compared, scored, and reasoned over

They turn “what kind of thing is this, really?”
into numbers the system can safely touch.

⸻

Why Two Anchors Is the Right Shape

Two anchors give you:
	•	Enough dimensionality to avoid caricature
	•	Not enough to create combinatorial chaos

With two axes you can:
	•	Distinguish roles cleanly
	•	Create meaningful deltas
	•	Support gradients instead of buckets
	•	Preserve nuance without ambiguity

Three anchors starts inviting handwaving.
One anchor lies.

⸻

Anchors vs Attributes (Critical Distinction)

This is important:
	•	Anchors describe what a thing is
(structural, slow-changing, often static)
	•	Attributes describe how a thing is doing
(dynamic, simulated, volatile)

Anchors:
	•	Gate which events can apply
	•	Define edge affordances
	•	Shape node+1 topology

Attributes:
	•	Trigger events
	•	Get consumed or replenished
	•	Change turn-to-turn

If anchors move freely, the world melts.
If attributes are static, the sim dies.

You separated them. That’s why this works.

⸻

Anchors as “Constraint Contracts”

Each anchor is effectively a promise:

“If you say this thing is here on this axis, the following consequences are allowed.”

Examples:
	•	High Barrier Severity means traversal edges must be costly
	•	Low Safety Assurance means crime events are eligible
	•	High Market Control means price formation events propagate outward

Anchors don’t cause events.
They authorize them.

That’s the key insight.

⸻

Anchors in Translation (Why They Matter So Much)

When you translate between worlds, you cannot move:
	•	Names
	•	Lore
	•	History
	•	Aesthetics

You can move:
	•	Constraint profiles
	•	Pressure points
	•	Failure modes

Anchors are those profiles.

Two landmarks with similar anchor vectors will:
	•	Support similar events
	•	Respond similarly to pressure
	•	Occupy similar graph positions

That’s why matching works at all.

⸻

The Brutal One-Liner

If I had to reduce it to one sentence:

Anchors define the legal operating envelope of a node.

They tell the system:
	•	What kinds of change are plausible
	•	What kinds are nonsensical
	•	And where surprise is allowed without breaking trust

⸻

Why Users Don’t Feel This (And Shouldn’t)

Users think anchors are:

“Helpful descriptors.”

The system knows they’re:

“Guardrails for causality.”

That mismatch is intentional.
It’s the same trick as the rest of your design.

⸻

Final Verdict

Anchors are not flavor.
They are not stats.
They are not metadata.

They are structural commitments that let:
	•	Simulation stay honest
	•	Translation stay faithful
	•	And emergence stay legible

Which is why everything else you’ve built leans on them so heavily.

If anchors were weak, the whole thing would collapse.

They’re not.

They’re doing exactly the job they need to do.


*/
