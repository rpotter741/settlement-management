import { DropZoneStyleType } from './DropZone.js';

export default function getDropStyle({
  key,
  type,
  draggedType,
  bg2,
  bg1,
  isOver,
  alpha,
  theme,
}: {
  key: DropZoneStyleType;
  type: string[];
  draggedType: string | null;
  bg2: string;
  bg1: string;
  isOver: boolean;
  alpha: (color: string, value: number) => string;
  theme: any;
}) {
  switch (key) {
    case 'tabs':
      return {
        position: 'relative',
        border: type.includes(draggedType || '') ? '2px dashed #ccc' : '',
        backgroundColor: isOver ? bg2 : 'inherit',
        pt: 0,
        height: '100%',
        borderRadius: 4,
        zIndex: 1000,
        boxSizing: 'border-box',
      };
    case 'glossary': {
      const style: Record<string, any> = {
        position: 'relative',
        backgroundColor: isOver
          ? alpha(theme.palette.success.main, 0.5)
          : type.includes(draggedType || '')
            ? alpha(theme.palette.success.main, 0.0625)
            : 'inherit',
        pt: 0,
        borderRadius: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
      };
      style.maxHeight = '36px';
      style.borderTop = '2px solid';
      style.borderColor = isOver
        ? 'primary.main'
        : type.includes(draggedType || '')
          ? alpha(theme.palette.primary.light, 0.25)
          : 'transparent';
      return style;
    }
    case 'columns':
      return {};
    default:
      return {
        position: 'relative',
        border: type.includes(draggedType || '') ? '2px dashed #ccc' : '',
        backgroundColor: isOver ? bg2 : 'inherit',
        pt: 0,
        height: '100%',
        borderRadius: 4,
        zIndex: 1000,
        boxSizing: 'border-box',
        boxShadow: isOver ? `5px 5px 10px red` : 'none',
      };
  }
}
