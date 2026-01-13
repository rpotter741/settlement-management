import { Button, Checkbox } from '@mui/material';

interface CheckButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  checked: boolean;
}

const CheckButton = ({ onClick, label, checked }: CheckButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="text"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        gap: 2,
        width: '100%',
        textTransform: 'none',
        color: (theme) => theme.palette.text.primary,
        px: 2,
      }}
    >
      <Checkbox checked={checked} size="small" />
      {label}
    </Button>
  );
};

export default CheckButton;
