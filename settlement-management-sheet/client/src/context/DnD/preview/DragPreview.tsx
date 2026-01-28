import DraggablePropertyEntry from '@/features/Glossary/EditGlossary/Templates/components/DnD/DraggablePropertyEntry.tsx';
import SidebarProperty from '@/features/SidePanel/Glossary/SubTypeManager/components/SidebarProperty.tsx';
import {
  defaultDropAnimationSideEffects,
  DragOverlay,
  useDndContext,
} from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useDnDContext } from '../GlobalDndContext.tsx';

const DragPreview = ({ children }: { children: React.ReactNode }) => {
  const { matches } = useDnDContext();

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: matches.current ? '0' : '1', // Hide the original ghost immediately
        },
        dragOverlay: {
          opacity: matches.current ? '0' : '1', // Keep the original ghost hidden after drop
        },
      },
    }),
  };

  // if (!matches && !active) return null;

  return (
    <DragOverlay dropAnimation={matches?.current ? null : dropAnimationConfig}>
      {children}
    </DragOverlay>
  );
};

export default DragPreview;
