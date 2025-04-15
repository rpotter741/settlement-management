import { VariableSizeList as List } from 'react-window';
import { useRef, useState, useEffect } from 'react';
import ActionsButton from './ActionsButton.jsx';
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';

const TableList = ({
  rows,
  type,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onSearch,
  onActionClick,
  options,
  infiniteScroll = true,
}) => {
  const loadMoreRef = useRef(null);
  const listRef = useRef();

  // search and filter
  const [search, setSearch] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [tagFilter, setTagFilter] = useState([]);
  // sort and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(infiniteScroll ? -1 : 10);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { root: null, rootMargin: '150px', threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
    if (listRef.current) listRef.current.resetAfterIndex(0);
  };

  const filteredRows = rows.filter(
    (row) =>
      row?.name?.toLowerCase().includes(search.toLowerCase()) &&
      (!contentTypeFilter || row.contentType === contentTypeFilter) &&
      (!statusFilter || row.status === statusFilter)
  );

  const getRowHeight = (index) =>
    expandedRow === filteredRows[index].refId ? 120 : 50;

  const Row = ({ index, style }) => {
    const row = filteredRows[index];

    return (
      <TableRow
        key={row.id}
        onClick={() => toggleExpand(row.refId, index)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderBottom: '1px solid',
          borderColor: 'secondary.main',
          cursor: 'pointer',
          '&:hover': { backgroundColor: 'background.default' },
        }}
        style={style} // Ensure virtualization works properly
      >
        <TableCell sx={{ flex: 1 }}>{row.name || '(Unnamed)'}</TableCell>
        {type === 'community' && (
          <TableCell sx={{ flex: 1 }}>{row.contentType}</TableCell>
        )}
        {type === 'community' && (
          <TableCell sx={{ flex: 1 }}>{row.createdBy}</TableCell>
        )}
        {type === 'personal' && (
          <TableCell sx={{ flex: 1 }}>{row.status}</TableCell>
        )}
        <TableCell sx={{ flex: 0.5, textAlign: 'end' }}>
          <ActionsButton
            options={options}
            onActionClick={onActionClick}
            refId={row.refId}
            id={row.id}
          />
        </TableCell>
        {expandedRow === row.refId && (
          <TableRow>
            <TableCell colSpan={4}>
              <Box
                sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}
              >
                <Typography variant="body2">{row.description}</Typography>
                <Typography variant="caption">
                  Tags: {row?.tags.join(', ')}
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        )}
      </TableRow>
    );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxHeight: '500px', overflowY: 'auto' }}
    >
      <Box
        sx={{
          display: 'flex',
          position: 'sticky',
          top: 0,
          pt: 2,
          flexWrap: 'wrap',
          backgroundColor: 'background.paper',
          zIndex: 5,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onSearch(e.target.value);
          }}
          sx={{ width: type === 'community' ? '26.667%' : '40%' }}
        />
        {type === 'community' && (
          <FormControl size="small" sx={{ minWidth: 150, width: '26.666%' }}>
            <InputLabel sx={{ backgroundColor: 'background.paper' }}>
              Content Type
            </InputLabel>
            <Select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
            >
              <MenuItem value="" key="all">
                All
              </MenuItem>
              <MenuItem value="CUSTOM" key="custom">
                Custom
              </MenuItem>
              <MenuItem value="OFFICIAL" key="official">
                Official
              </MenuItem>
            </Select>
          </FormControl>
        )}

        {type === 'personal' && (
          <FormControl size="small" sx={{ minWidth: 150, width: '40%' }}>
            <InputLabel sx={{ backgroundColor: 'background.paper' }}>
              Status
            </InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="" key="all">
                All
              </MenuItem>
              <MenuItem value="DRAFT" key="draft">
                Draft
              </MenuItem>
              <MenuItem value="PUBLISHED" key="published">
                Published
              </MenuItem>
            </Select>
          </FormControl>
        )}

        {type === 'community' && (
          <FormControl size="small" sx={{ minWidth: 150, width: '26.667%' }}>
            <InputLabel sx={{ backgroundColor: 'background.paper' }}>
              Created By
            </InputLabel>
            <Select
              value={createdByFilter}
              onChange={(e) => setCreatedByFilter(e.target.value)}
            >
              <MenuItem value="" key="all">
                All
              </MenuItem>
              {Array.from(new Set(rows.map((row) => row.createdBy))).map(
                (creator) => (
                  <MenuItem key={creator} value={creator}>
                    {creator}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        )}
        <FormControl size="small" sx={{ minWidth: 150, width: '20%' }}>
          <InputLabel sx={{ backgroundColor: 'background.paper' }}>
            Tags
          </InputLabel>
          {/* <Select
            multiple
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            {Array.from(new Set(rows.flatMap((row) => row?.tags))).map(
              (tag) => (
                <MenuItem key={tag} value={tag}>
                  <Checkbox checked={tagFilter.includes(tag)} />
                  <ListItemText primary={tag} />
                </MenuItem>
              )
            )}
          </Select> */}
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            backgroundColor: 'honey.light',
            width: '100%',
            zIndex: '5',
          }}
        >
          <Box
            sx={{
              width: type === 'community' ? '26.667%' : '40%',
              fontWeight: 'bold',
              px: 1,
            }}
          >
            Name
          </Box>
          {type === 'community' && (
            <Box
              sx={{
                width: type === 'community' ? '26.667%' : '40%',
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 1,
              }}
            >
              Content Type
            </Box>
          )}
          {type === 'community' && (
            <Box
              sx={{
                width: type === 'community' ? '26.667%' : '40%',
                fontSize: '1rem',
                fontWeight: 'bold',
                px: 1,
              }}
            >
              Created By
            </Box>
          )}
          {type === 'personal' && (
            <Box
              sx={{
                width: '40%',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Status
            </Box>
          )}
          <Box
            sx={{
              width: '20%',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'end',
              pr: 2,
            }}
          >
            Actions
          </Box>
        </Box>
      </Box>
      <Table sx={{ minWidth: 650 }} aria-label="attributes table">
        <TableBody>
          <List
            ref={listRef}
            height={500}
            itemCount={filteredRows.length}
            itemSize={getRowHeight}
            width="100%"
          >
            {Row}
          </List>
          <TableRow ref={loadMoreRef}>
            {isFetchingNextPage ? (
              <TableCell colSpan={6}>Loading...</TableCell>
            ) : filteredRows.length > 0 ? (
              <TableCell colSpan={6} align="center">
                End of the List!
              </TableCell>
            ) : null}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableList;
