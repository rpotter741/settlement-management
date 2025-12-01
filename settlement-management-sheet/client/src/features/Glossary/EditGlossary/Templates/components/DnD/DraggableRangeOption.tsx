import { Delete } from '@mui/icons-material';
import { Box, IconButton, MenuItem, Typography } from '@mui/material';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const DraggableRangeOption = ({
  index,
  option,
  property,
  handleChange,
  setHoverString,
  hoverString,
  hoverIndex,
  setHoverIndex,
  reorderList,
}: {
  index: number;
  option: string;
  property: any;
  handleChange: (value: any, keypath: string) => void;
  setHoverString: (value: string) => void;
  hoverString: string;
  hoverIndex: number | null;
  setHoverIndex: (index: number | null) => void;
  reorderList: (fromIndex: number, toIndex: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drag] = useDrag({
    type: 'range-option',
    item: { index },
  });

  const [, drop] = useDrop({
    accept: 'range-option',
    hover: () => {
      setHoverIndex(index);
    },
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        reorderList(item.index, index);
      }
      setHoverIndex(null);
    },
  });

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      key={index}
      sx={{
        textAlign: 'start',
        height: 36,
        border: 1,
        borderColor: hoverIndex === index ? 'primary.main' : 'transparent',
      }}
    >
      <MenuItem
        sx={{
          position: 'relative',
          width: 'calc(100% - 40px)',
          '&:hover': {
            cursor: 'grab',
            textDecoration: 'underline',
          },
        }}
        onMouseEnter={() => setHoverString(option)}
        onMouseLeave={() => setHoverString('')}
        title={hoverString === option ? option : ''}
      >
        {hoverString === option && (
          <IconButton
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onClick={() => {
              const currentOptions = property?.options || [];
              handleChange(
                currentOptions.filter((o: string) => o !== option),
                'shape.options'
              );
            }}
          >
            <Delete />
          </IconButton>
        )}
        <Typography sx={{ pl: 4 }}>{`${index + 1}. ${option}`}</Typography>
      </MenuItem>
    </Box>
  );
};

export default DraggableRangeOption;
