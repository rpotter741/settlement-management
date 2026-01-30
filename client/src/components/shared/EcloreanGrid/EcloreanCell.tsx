import { DragHandle } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';

interface EcloreanCellProps {
  borderColor?: string;
  children: React.ReactNode;
  width?: string[] | string;
  onClick?: () => void;
  onHover?: () => void;
  maxHeight?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
}

const EcloreanCell: React.FC<EcloreanCellProps> = ({
  borderColor = 'secondary.main',
  children,
  onClick,
  onHover,
  width = '250px',
  maxHeight = '56px',
  style = {},
  ref,
}) => {
  //
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
      }}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onHover}
    >
      {children}
    </Box>
  );
};

export default EcloreanCell;
