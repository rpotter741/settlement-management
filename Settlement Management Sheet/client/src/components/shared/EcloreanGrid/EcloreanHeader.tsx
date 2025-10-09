import useTheming from '@/hooks/layout/useTheming.js';
import { DragHandle } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

interface EcloreanCellProps {
  borderColor?: string;
  children: React.ReactNode;
  width?: string[] | string;
  onClick?: () => void;
  onHover?: () => void;
  maxHeight?: string;
  style?: React.CSSProperties;
  index: number;
  reorderColumns: (fromIndex: number, toIndex: number) => void;
  setHoverIndex: (index: number | null) => void;
  hoverIndex: number | null;
  sortDirection: 'asc' | 'desc' | null;
}

const EcloreanHeader: React.FC<EcloreanCellProps> = ({
  borderColor = 'secondary.main',
  children,
  onClick,
  onHover,
  width = '250px',
  maxHeight = '56px',
  style = {},
  index,
  reorderColumns,
  setHoverIndex,
  hoverIndex,
  sortDirection = null,
}) => {
  //
  const ref = useRef<HTMLDivElement>(null);

  const { getAlphaColor } = useTheming();

  const [, drag] = useDrag({
    type: 'COLUMN',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: () => {
      setHoverIndex(index);
    },
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        reorderColumns(item.index, index);
        item.index = index; // keep item index in sync
      }
      setHoverIndex(null);
    },
  });

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      sx={{
        p: 2,
        borderRight: '1px solid',
        borderColor,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width,
        maxHeight,
        textAlign: 'start',
        flex: '0 0 auto',
        ...style,
        position: 'relative',
        '&:hover': {
          backgroundColor: getAlphaColor({
            color: 'primary',
            key: 'main',
            opacity: 0.2,
          }),
        },
        backgroundColor:
          hoverIndex === index
            ? getAlphaColor({
                color: 'success',
                key: 'main',
                opacity: 0.33,
              })
            : 'inherit',
      }}
      onClick={onClick}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      {children}
      {sortDirection && (sortDirection === 'asc' ? ' 🔼' : ' 🔽')}
    </Box>
  );
};

export default EcloreanHeader;
