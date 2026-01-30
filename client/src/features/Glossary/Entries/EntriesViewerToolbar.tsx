import { Pin, PushPin } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { Box } from '@mui/system';
import { glossaryEntryTypeOptions } from '../../../../../shared/types/index.js';
import capitalize from '@/utility/inputs/capitalize.js';
import { EntriesViewerTableState } from './useEntriesViewer.js';
import FilterMenu from './filters/EntryTypeFilter.js';
import { usePropertyLabel } from '../utils/getPropertyLabel.js';
import { useSelector } from 'react-redux';
import { selectActiveId } from '@/app/selectors/glossarySelectors.js';

interface EntriesViewerToolbarProps {
  tableState: EntriesViewerTableState;
  updateTableState: (updates: any) => void;
}

const EntriesViewerToolbar = ({
  tableState,
  updateTableState,
}: EntriesViewerToolbarProps) => {
  //
  const activeId = useSelector(selectActiveId());
  const { getPropertyLabel } = usePropertyLabel();
  if (!activeId) return null;

  return (
    <Box
      sx={{
        mt: 2,
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: 2,
      }}
    >
      <FilterMenu
        options={glossaryEntryTypeOptions.map((option) => {
          const { label } = getPropertyLabel('system', option);
          return { label: capitalize(label), value: option };
        })}
        source={tableState.filters}
        onChange={updateTableState}
        keyFilter={'entryType'}
        placeholder="Filter by Entry Type"
      />

      <ButtonGroup
        variant="outlined"
        aria-label="outlined button group"
        size="small"
        sx={{ gap: 1 }}
      >
        <Tooltip
          title={tableState.pinSelectedRows ? 'Unpin Selected' : 'Pin Selected'}
        >
          <Button
            variant={tableState.pinSelectedRows ? 'contained' : 'outlined'}
            onClick={() =>
              updateTableState({ pinSelectedRows: !tableState.pinSelectedRows })
            }
          >
            <PushPin />
          </Button>
        </Tooltip>
        <Tooltip
          title={
            tableState.filterMode === 'and'
              ? 'AND Filter Mode'
              : 'OR Filter Mode'
          }
        >
          <Button
            color={tableState.filterMode === 'and' ? 'primary' : 'secondary'}
            variant={'contained'}
            onClick={() =>
              updateTableState({
                filterMode: tableState.filterMode === 'and' ? 'or' : 'and',
              })
            }
          >
            {tableState.filterMode === 'and' ? 'Exclusive' : 'Inclusive'}
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default EntriesViewerToolbar;
