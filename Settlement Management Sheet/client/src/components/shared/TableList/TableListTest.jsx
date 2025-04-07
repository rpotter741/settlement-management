import { VariableSizeList as List } from 'react-window';
import { useRef, useState, useEffect } from 'react';
import ActionsButton from './ActionsButton.jsx';
import {
  TableContainer,
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
  onDelete,
  checkbox = false,
  selected,
  setSelected,
  maxSelections,
  infiniteScroll = true,
  options = [],
}) => {
  const loadMoreRef = useRef(null);
  const listRef = useRef();

  // search and filter
  const [search, setSearch] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [tagFilter, setTagFilter] = useState([]);

  const onCheckboxChange = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (listRef.current) listRef.current.resetAfterIndex(0, true);
  }, [
    rows,
    search,
    contentTypeFilter,
    statusFilter,
    createdByFilter,
    tagFilter,
  ]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
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
    const isLastItem = index === filteredRows.length - 1;

    if (!row) {
      return (
        <TableRow style={style}>
          <TableCell colSpan={6}>
            <Skeleton animation="wave" height={40} />
          </TableCell>
        </TableRow>
      );
    }

    return (
      <Box
        ref={isLastItem ? loadMoreRef : null}
        key={row.refId}
        onClick={() => toggleExpand(row.refId, index)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          borderBottom: '1px solid',
          borderColor: 'secondary.main',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.default',
            borderTop: '1px solid',
            boxSizing: 'border-box',
          },
        }}
        style={style} // Ensure virtualization works properly
      >
        <Box sx={{ flex: 1, p: 2 }}>{row.name || '(Unnamed)'}</Box>
        {type === 'community' && (
          <Box sx={{ flex: 1, p: 2 }}>{row.contentType}</Box>
        )}
        {type === 'community' && (
          <Box sx={{ flex: 1, p: 2 }}>{row.createdBy}</Box>
        )}
        {type === 'personal' && <Box sx={{ flex: 1, p: 2 }}>{row.status}</Box>}
        <Box sx={{ flex: 0.5, textAlign: 'end' }}>
          {!checkbox ? (
            <ActionsButton
              options={options}
              onActionClick={onActionClick}
              refId={row.refId}
              id={row.id}
              onDelete={onDelete}
            />
          ) : (
            <Checkbox
              onChange={() => onCheckboxChange(row.id)}
              checked={selected.includes(row.id)}
              disabled={
                selected.length >= maxSelections && !selected.includes(row.id)
              }
            />
          )}
        </Box>
        {expandedRow === row.refId && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  borderRadius: 1,
                  width: '85%',
                }}
              >
                <Typography variant="body2">{row.description}</Typography>
                <Typography variant="caption">
                  Tags: {row.tags.join(', ')}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <TableContainer component={Paper}>
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
          <Select
            multiple
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            {Array.from(new Set(rows.flatMap((row) => row.tags))).map((tag) => (
              <MenuItem key={tag} value={tag}>
                <Checkbox checked={tagFilter.includes(tag)} />
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 2,
            backgroundColor: 'honey.light',
            width: '100%',
            zIndex: '5',
            mb: 1,
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
      <Box sx={{ minWidth: 650 }} aria-label="attributes table">
        <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
          <List
            key={filteredRows.length}
            ref={listRef}
            height={500}
            itemCount={filteredRows.length}
            itemSize={getRowHeight}
            width="100%"
            overscanCount={5}
          >
            {Row}
          </List>
          <Box>{isFetchingNextPage && <Box colSpan={6}>Loading...</Box>}</Box>
        </Box>
      </Box>
    </TableContainer>
  );
};

export default TableList;
