import { dispatch } from '@/app/constants.ts';
import { addPropertyToGroupThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyToGroupThunk.ts';
import { movePropertyToEnd } from '@/app/thunks/glossary/subtypes/groups/movePropertyToEnd.ts';
import useSnackbar from '@/hooks/global/useSnackbar.tsx';
import {
  Active,
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  Over,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Box } from '@mui/material';
import {
  createContext,
  MutableRefObject,
  Ref,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import DragPreview from './preview/DragPreview.tsx';
import { addPropertyAtIndexThunk } from '@/app/thunks/glossary/subtypes/groups/addPropertyAtIndexThunk.ts';
import { showSnackbar } from '@/app/slice/snackbarSlice.ts';
import { reorderPropertyToIndex } from '@/app/thunks/glossary/subtypes/groups/reorderPropertyToIndexThunk.ts';

interface DnDContextType {
  matches: MutableRefObject<boolean>;
  dragType: MutableRefObject<string | null>;
}

export const DnDContext = createContext<DnDContextType | undefined>(undefined);

function GlobalDndContext({ children }: { children: React.ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const { makeSnackbar } = useSnackbar();
  const matches = useRef<boolean>(false);
  const dragType = useRef<string | null>(null);

  const onDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    dragType.current = active.data.current?.type || null;
  }, []);

  const onDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || !over.data.current?.dropType || active.id === over.id) {
      if (matches.current) {
        matches.current = false;
      }
    }
    const doesAccept = over?.data.current?.accepts?.includes(
      active.data.current?.type
    );
    if (doesAccept) {
      matches.current = true;
    }
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !over.data.current?.dropType || active.id === over.id) return;

    const doesAccept = over.data.current?.accepts?.includes(
      active.data.current?.type || false
    );

    if (!doesAccept) return;

    const dropType = over.data.current.dropType;

    const methodMap =
      handleDropRegistry[dropType as keyof typeof handleDropRegistry];
    if (!methodMap) return;

    const activeType = active.data.current?.type;

    const handleDrop = methodMap[activeType];

    if (typeof handleDrop === 'function') {
      console.log('doing a drop');
      handleDrop(active, over);
    } else {
      console.warn(
        `No drop handler for active type "${activeType}" on drop type "${dropType}"`
      );
      makeSnackbar({
        message: 'You done broke the drag and drop!',
        type: 'error',
      });
    }
    dragType.current = null;
  }, []);

  const onDragCancel = useCallback((event: DragCancelEvent) => {}, []);

  const contextValue = useMemo(() => ({ matches, dragType }), []);

  return (
    <DnDContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
        {children}
      </DndContext>
    </DnDContext.Provider>
  );
}

export default GlobalDndContext;

export const useDnDContext = (dropTypes?: string[]) => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnDContext must be used within a DnDProvider');
  }
  const { active, over } = useDndContext();
  const { matches, dragType } = context;

  return { active, over, matches, dragType };
};

/* ----------------------------------------------- */
/* -------------DropType -> DragType-------------- */
/* ----------------------------------------------- */

const subTypePropertyDragAcceptMap: Record<
  string,
  (active: Active, over: Over) => void
> = {
  'subtype-property': (active, over) => {},
};

const subTypeGroupDragAcceptMap: Record<
  string,
  (active: Active, over: Over) => void
> = {
  'subtype-property': (active, over) => {
    dispatch(
      addPropertyToGroupThunk({
        groupId: over.id as string,
        propertyId: active.id as string,
      })
    );
  },
  'subtype-group-property': (active, over) => {
    //reordering within group handled in DraggablePropertyEntry
    dispatch(
      movePropertyToEnd({
        groupId: over.id as string,
        propertyId: active.id as string,
      })
    );
  },
};

// need to make a create + insert @ index thunk for this to work properly
const subTypeGroupPropertyAcceptMap: Record<
  string,
  (active: Active, over: Over) => void
> = {
  'subtype-property': (active, over) => {
    const groupId = over.data.current?.item.groupId as string;
    const propertyId = active.id as string;
    const dropIndex = over.data.current?.index as number;
    if (!groupId || !propertyId || dropIndex === undefined) {
      dispatch(
        showSnackbar({
          message: 'Now you fucked up',
          type: 'warning',
        })
      );
      return;
    }
    dispatch(
      addPropertyAtIndexThunk({
        groupId,
        propertyId,
        dropIndex,
      })
    );
  },
  'subtype-group-property': (active, over) => {
    console.log(over.data.current?.index);
    const groupId = over.data.current?.item.groupId as string;
    const propertyId = active.id as string;
    const dropIndex = over.data.current?.index as number;
    if (!groupId || !propertyId || dropIndex === undefined) {
      dispatch(
        showSnackbar({
          message: 'Now you fucked up',
          type: 'warning',
        })
      );
      return;
    }
    dispatch(
      reorderPropertyToIndex({
        groupId,
        propertyId,
        dropIndex,
      })
    );
  },
};

const subTypeAreaDragAcceptMap: Record<
  string,
  (active: Active, over: Over) => void
> = {
  'subtype-group': (active, over) => {},
};

/* ----------------------------------------------- */
/* -----------------Drop Registry----------------- */
/* ----------------------------------------------- */

//first is drop type, second is accept type
const handleDropRegistry = {
  'subtype-property': subTypePropertyDragAcceptMap,
  'subtype-group': subTypeGroupDragAcceptMap,
  'subtype-group-property': subTypeGroupPropertyAcceptMap,
  'subtype-area': subTypeAreaDragAcceptMap,
};
