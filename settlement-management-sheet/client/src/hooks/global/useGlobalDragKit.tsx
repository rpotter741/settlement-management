import { GenericObject } from '../../../../shared/types/common.js';
import { useSortable } from '@dnd-kit/sortable';
import { useDndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export type DragInteraction = 'drag' | 'drop' | 'both';

export interface UseGlobalDrag {
  id: string;
  type: string;
  item: GenericObject;
  index: number;
  interaction: 'drag';
}

export interface UseGlobalDrop {
  id: string;
  dropType: string;
  types: string[];
  index: number;
  interaction: 'drop';
}

export interface UseGlobalDragAndDrop {
  id: string;
  dropType: string;
  type: string;
  types: string[];
  index: number;
  item: any;
  interaction: 'both';
}

type DnDConfig = UseGlobalDrag | UseGlobalDrop | UseGlobalDragAndDrop;

const useGlobalDrag = <T extends DnDConfig>(config: T) => {
  const { id } = config;
  const { active, over } = useDndContext();
  const draggedType = active?.data?.current?.type;

  const baseReturn = {
    ref: null as any,
    dragHandleProps: {} as any,
    style: {} as any,
    canAccept: false,
    isOver: false,
  };

  if (config.interaction === undefined) {
    throw new Error('interaction type must be defined as drag, drop, or both');
  }

  let matchesDragType = false;

  if (config.interaction === 'drag') {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
      data: {
        type: config.type,
        index: config.index,
        item: config.item,
      },
      attributes: {
        role: config.type,
      },
    });

    const dragHandleProps = { ...attributes, ...listeners };
    const style = {
      transform: transform ? CSS.Transform.toString(transform) : undefined,
    };
    return {
      ...baseReturn,
      ref: setNodeRef,
      dragHandleProps,
      style,
    };
  }

  if (config.interaction === 'drop') {
    matchesDragType = draggedType ? config.types.includes(draggedType) : false;

    const { setNodeRef, isOver } = useDroppable({
      id,
      data: {
        dropType: config.dropType,
        accepts: config.types,
        index: config.index,
      },
    });

    return {
      ...baseReturn,
      ref: setNodeRef,
      canAccept: matchesDragType,
      isOver,
    };
  }

  if (config.interaction === 'both') {
    const { attributes, listeners, setNodeRef, transform, transition, isOver } =
      useSortable({
        id,
        data: {
          type: config.type,
          index: config.index,
          item: config.item,
          dropType: config.dropType,
          accepts: config.types,
        },
        attributes: {
          role: config.type,
        },
      });

    const dragHandleProps = { ...attributes, ...listeners };
    const style = {
      transform: transform ? CSS.Transform.toString(transform) : undefined,
      transition,
    };
    matchesDragType = draggedType ? config.types.includes(draggedType) : false;
    return {
      ...baseReturn,
      ref: setNodeRef,
      dragHandleProps,
      style,
      canAccept: matchesDragType,
      isOver,
    };
  }
  return baseReturn;
};

export default useGlobalDrag;
