import {
  Button,
  Checkbox,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

const SubTypeNameMenu = ({
  width,
  nameAnchor,
  handleMenu,
  closeMenu,
  nameSort,
  setNameSort,
}: {
  width: string;
  nameAnchor: null | HTMLElement;
  handleMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    type: 'type' | 'name' | 'content'
  ) => void;
  closeMenu: () => void;
  nameSort: 'asc' | 'desc' | null;
  setNameSort: (sort: 'asc' | 'desc' | null) => void;
}) => {
  const open = Boolean(nameAnchor);

  return (
    <>
      <Button
        variant="text"
        id="subtype-select-type-menu-button"
        aria-controls={open ? 'subtype-select-type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => handleMenu(event, 'name')}
        sx={{
          textTransform: 'none',
          width,
          color: 'text.primary',
          p: 0,
        }}
      >
        <Typography variant="caption" sx={{ textAlign: 'left', width: '100%' }}>
          Name
        </Typography>
      </Button>
      <Menu
        id="subtype-select-type-menu"
        anchorEl={nameAnchor}
        open={open}
        onClose={closeMenu}
      >
        <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
          Sort By Name
        </Typography>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 0.5,
            px: 2,
          }}
        >
          <Typography sx={{ fontSize: '0.875rem' }}>Ascending</Typography>
          <Checkbox
            size="small"
            checked={nameSort === 'asc'}
            onChange={() => setNameSort(nameSort === 'asc' ? null : 'asc')}
          />
        </MenuItem>
        <MenuItem
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 0.5,
            px: 2,
          }}
        >
          <Typography sx={{ fontSize: '0.875rem' }}>Descending</Typography>
          <Checkbox
            size="small"
            checked={nameSort === 'desc'}
            onChange={() => setNameSort(nameSort === 'desc' ? null : 'desc')}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default SubTypeNameMenu;
