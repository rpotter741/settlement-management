import { Button } from '@mui/material';

const SubTypeSelectButton = ({
  subType,
  editId,
  onClick,
}: {
  subType: any;
  editId: string | null;
  onClick: () => void;
}) => {
  return (
    <Button
      fullWidth
      sx={{ mt: 2 }}
      variant={subType.id === editId ? 'contained' : 'outlined'}
      color={
        subType.id === editId
          ? 'success'
          : subType.createdBy === 'system'
            ? 'secondary'
            : 'primary'
      }
      key={subType.id}
      onClick={onClick}
    >
      {subType.name}
    </Button>
  );
};

export default SubTypeSelectButton;
