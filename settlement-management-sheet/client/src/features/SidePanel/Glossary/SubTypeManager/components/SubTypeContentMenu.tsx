import {
  Button,
  Checkbox,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

const SubTypeContentMenu = ({
  width,
  contentAnchor,
  handleMenu,
  closeMenu,
  contentSort,
  setContentSort,
  contentFilters,
  setContentFilters,
}: {
  width: string;
  contentAnchor: null | HTMLElement;
  handleMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    type: 'type' | 'name' | 'content'
  ) => void;
  closeMenu: () => void;
  contentSort: 'asc' | 'desc' | null;
  setContentSort: (sort: 'asc' | 'desc' | null) => void;
  contentFilters: string[];
  setContentFilters: (filters: string[]) => void;
}) => {
  const open = Boolean(contentAnchor);

  return (
    <>
      <Button
        variant="text"
        id="subtype-select-type-menu-button"
        aria-controls={open ? 'subtype-select-type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => handleMenu(event, 'content')}
        sx={{
          textTransform: 'none',
          width,
          color: 'text.primary',
          p: 0,
        }}
      >
        <Typography variant="caption" sx={{ textAlign: 'left', width: '100%' }}>
          Content
        </Typography>
      </Button>
      <Menu
        id="subtype-select-type-menu"
        anchorEl={contentAnchor}
        open={open}
        onClose={closeMenu}
      >
        <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
          Sort By Content
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
            checked={contentSort === 'asc'}
            onChange={() =>
              setContentSort(contentSort === 'asc' ? null : 'asc')
            }
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
            checked={contentSort === 'desc'}
            onChange={() =>
              setContentSort(contentSort === 'desc' ? null : 'desc')
            }
          />
        </MenuItem>
        <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
          Filter By Content
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
          <Typography sx={{ fontSize: '0.875rem' }}>System</Typography>
          <Checkbox
            size="small"
            checked={contentFilters.includes('SYSTEM')}
            onChange={() => {
              if (contentFilters.includes('SYSTEM')) {
                setContentFilters(contentFilters.filter((f) => f !== 'SYSTEM'));
              } else {
                setContentFilters([...contentFilters, 'SYSTEM']);
              }
            }}
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
          <Typography sx={{ fontSize: '0.875rem' }}>Custom</Typography>
          <Checkbox
            size="small"
            checked={contentFilters.includes('CUSTOM')}
            onChange={() => {
              if (contentFilters.includes('CUSTOM')) {
                setContentFilters(contentFilters.filter((f) => f !== 'CUSTOM'));
              } else {
                setContentFilters([...contentFilters, 'CUSTOM']);
              }
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default SubTypeContentMenu;
