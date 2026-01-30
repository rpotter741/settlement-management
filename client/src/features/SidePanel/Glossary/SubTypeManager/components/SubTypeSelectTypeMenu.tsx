import {
  Box,
  Button,
  Checkbox,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../../../shared/types/index.js';
import { usePropertyLabel } from '@/features/Glossary/utils/getPropertyLabel.js';

const SubTypeSelectTypeMenu = ({
  width,
  typeFilters,
  setTypeFilters,
  typeAnchor,
  handleMenu,
  closeMenu,
  typeSort,
  setTypeSort,
}: {
  width: string;
  typeFilters: GlossaryEntryType[];
  setTypeFilters: (filters: GlossaryEntryType[]) => void;
  typeAnchor: null | HTMLElement;
  handleMenu: (
    event: React.MouseEvent<HTMLButtonElement>,
    type: 'type' | 'name' | 'content'
  ) => void;
  closeMenu: () => void;
  typeSort: 'asc' | 'desc' | null;
  setTypeSort: (sort: 'asc' | 'desc' | null) => void;
}) => {
  const open = Boolean(typeAnchor);
  const { getPropertyLabel } = usePropertyLabel();

  return (
    <>
      <Button
        variant="text"
        id="subtype-select-type-menu-button"
        aria-controls={open ? 'subtype-select-type-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(event) => handleMenu(event, 'type')}
        sx={{
          textTransform: 'none',
          width,
          color: 'text.primary',
          p: 0,
        }}
      >
        <Typography variant="caption" sx={{ textAlign: 'left', width: '100%' }}>
          Type
        </Typography>
      </Button>
      <Menu
        id="subtype-select-type-menu"
        anchorEl={typeAnchor}
        open={open}
        onClose={closeMenu}
      >
        <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
          Sort By Type
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
            checked={typeSort === 'asc'}
            onChange={() => setTypeSort(typeSort === 'asc' ? null : 'asc')}
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
            checked={typeSort === 'desc'}
            onChange={() => setTypeSort(typeSort === 'desc' ? null : 'desc')}
          />
        </MenuItem>
        <Typography sx={{ px: 2, pt: 1, fontWeight: 'bold' }}>
          Filter By Type
        </Typography>
        <Divider sx={{ my: 1 }} />
        {glossaryEntryTypeOptions.map((filter) => (
          <MenuItem
            key={filter}
            onClick={() => {
              if (typeFilters.includes(filter)) {
                setTypeFilters(typeFilters.filter((f) => f !== filter));
              } else {
                setTypeFilters([...typeFilters, filter]);
              }
            }}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 0.5,
              px: 2,
            }}
          >
            <Typography sx={{ fontSize: '0.875rem' }}>
              {getPropertyLabel(filter).label || filter}
            </Typography>
            <Checkbox
              size="small"
              checked={typeFilters.includes(filter)}
              onChange={() => {
                if (typeFilters.includes(filter)) {
                  setTypeFilters(typeFilters.filter((f) => f !== filter));
                } else {
                  setTypeFilters([...typeFilters, filter]);
                }
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SubTypeSelectTypeMenu;
