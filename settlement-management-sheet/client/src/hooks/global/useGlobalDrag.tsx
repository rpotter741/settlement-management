import { useGlobalDragContext } from '@/context/DnD/GlobalDrag.js';
import { useDrag, useDrop } from 'react-dnd';
import { ulid as newId } from 'ulid';
import { GenericObject } from '../../../../shared/types/common.js';
import { useEffect, useRef } from 'react';

export type DragInteraction = 'drag' | 'drop' | 'both';

export interface UseGlobalDrag {
  type: string;
  item: GenericObject;
  index: number;
  interaction: 'drag';
  onEnd?: () => void;
}

export interface UseGlobalDrop {
  types: string[];
  onHover: (item: any, monitor: any) => void;
  onDrop: (item: any, monitor: any) => void;
  index: number;
  interaction: 'drop';
}

export interface UseGlobalDragAndDrop {
  type: string;
  types: string[];
  onHover: (item: any, monitor: any) => void;
  onDrop: (item: any, monitor: any) => void;
  onEnd?: () => void;
  index: number;
  item: GenericObject;
  interaction: 'both';
}

type DnDConfig = UseGlobalDrag | UseGlobalDrop | UseGlobalDragAndDrop;

const useGlobalDrag = <T extends DnDConfig>(config: T) => {
  const context = useGlobalDragContext();
  const {
    isDragging,
    draggedType,
    draggedItem,
    startDrag,
    endDrag,
    lastDragged,
    draggedId,
    hoverId,
    setHoverId,
  } = context;

  const id = newId(); // unique id for this hook instance
  const ref = useRef<HTMLElement>(null);

  if (config.interaction === undefined) {
    throw new Error('interaction type must be defined as drag, drop, or both');
  }

  let matchesDragType = false;

  if (config.interaction === 'drag') {
    const { type, index, item, onEnd } = config;

    const [, drag] = useDrag({
      type: type ?? 'yo shit busted bruh',
      item: () => {
        startDrag(type ?? 'yo shit busted bruh', item, id);
        return item ? { ...item, index } : { index };
      },
      end: () => {
        onEnd && onEnd();
        endDrag();
      },
    });

    drag(ref);
  }

  if (config.interaction === 'drop') {
    const { types, onHover, onDrop, index } = config;

    const [{ isOver }, drop] = useDrop({
      accept: types ?? [],
      hover: (item: any, monitor) => {
        if (onHover && draggedId !== id) {
          onHover(item, monitor);
        }
      },
      drop: (item: any, monitor) => {
        if (onDrop && draggedId !== id) {
          onDrop(item, monitor);
          endDrag();
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    drop(ref);
    matchesDragType = draggedType ? types?.includes(draggedType) : false;
  }

  if (config.interaction === 'both') {
    const { type, types, onHover, onDrop, index, item, onEnd } = config;

    const [, drag] = useDrag({
      type: type ?? 'yo shit busted bruh',
      item: () => {
        startDrag(type ?? 'yo shit busted bruh', item, id);
        return item ? { ...item, index } : { index };
      },
      end: () => {
        onEnd && onEnd();
        endDrag();
      },
    });

    const [{ isOver }, drop] = useDrop({
      accept: types ?? [],
      hover: (item: any, monitor) => {
        if (onHover && draggedId !== id) {
          onHover(item, monitor);
        }
        if (!monitor.isOver && onEnd) {
          onEnd();
        }
      },
      drop: (item: any, monitor) => {
        if (onDrop && draggedId !== id) {
          onDrop(item, monitor);
          endDrag();
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    });

    drag(drop(ref));
    matchesDragType = draggedType ? types?.includes(draggedType) : false;
  }

  return { ref, draggedType, isDragging, matchesDragType, hoverId, setHoverId };
};

export default useGlobalDrag;
