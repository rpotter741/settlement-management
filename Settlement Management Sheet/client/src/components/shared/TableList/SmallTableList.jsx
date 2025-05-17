import { VariableSizeList as List } from 'react-window';
import { useRef, useState, useEffect } from 'react';
import SmallActions from './SmallActions.jsx';
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
  Button,
  Divider,
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
  onConfirm,
}) => {
  const loadMoreRef = useRef(null);
  const listRef = useRef();

  // search and filter
  const [search, setSearch] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [tagFilter, setTagFilter] = useState([]);

  const onCheckboxChange = (e, { id, refId }) => {
    e.stopPropagation();
    setSelected((prev) => {
      const alreadySelected = prev.ids.includes(id);

      if (alreadySelected) {
        // Remove both id and corresponding refId
        return {
          ids: prev.ids.filter((item) => item !== id),
          refIds: prev.refIds.filter((item) => item !== refId),
        };
      } else {
        // Add both id and refId
        return {
          ids: [...prev.ids, id],
          refIds: [...prev.refIds, refId],
        };
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

  const toggleExpand = (rowRefId) => {
    setExpandedRow(expandedRow === rowRefId ? null : rowRefId);
    if (listRef.current) listRef.current.resetAfterIndex(0);
  };

  const filteredRows = rows.filter(
    (row) =>
      row?.name?.toLowerCase().includes(search.toLowerCase()) &&
      (!contentTypeFilter || row.contentType === contentTypeFilter) &&
      (!statusFilter || row.status === statusFilter)
  );

  const getRowHeight = (index) =>
    expandedRow === filteredRows[index].refId ? 175 : 55;

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
          },
          boxSizing: 'border-box',
          flexWrap: 'wrap',
          overflowY: expandedRow === row.refId ? 'scroll' : 'hidden',
        }}
        style={style} // Ensure virtualization works properly
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            maxHeight: 55,
            height: 55,
            width: '100%',
            pr: 1,
          }}
        >
          <Box sx={{ flex: 1, p: 0.5, alignItems: 'center' }}>
            <Typography variant="body2" textAlign="left" sx={{ pl: 1 }}>
              {row.name || '(Unnamed)'}
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: 'secondary.main',
              height: '60%',
              mx: 1,
              mt: 1.5,
            }}
          />
          <Box sx={{ flex: 0.5, textAlign: 'end', maxHeight: 55 }}>
            {!checkbox ? (
              <SmallActions
                options={options}
                onActionClick={onActionClick}
                refId={row.refId}
                id={row.id}
                onDelete={onDelete}
              />
            ) : (
              <Checkbox
                sx={{ zIndex: 3 }}
                onClick={(e) =>
                  onCheckboxChange(e, { id: row.id, refId: row.refId })
                }
                checked={selected.ids.includes(row.id)}
                disabled={
                  selected.length >= maxSelections && !selected.includes(row.id)
                }
              />
            )}
          </Box>
        </Box>
        {expandedRow === row.refId && (
          <Box>
            <Divider
              flexItem
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Description
            </Divider>
            <Box sx={{ width: '85%', p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'start',
                }}
              >
                <Box>
                  <Typography variant="body2">{row.description}</Typography>
                  <Typography variant="caption">
                    Tags: {row.tags.join(', ')}
                  </Typography>
                </Box>
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
          flexWrap: 'wrap',
          backgroundColor: 'background.paper',
          zIndex: 5,
          my: 1,
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
          sx={{ width: type === 'community' ? '50%' : '100%' }}
        />
        {type === 'community' && (
          <FormControl size="small" sx={{ width: '50%' }}>
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
          <FormControl size="small" sx={{ width: '50%' }}>
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
          <FormControl size="small" sx={{ width: '50%' }}>
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
              {Array.from(new Set(rows.map((row) => row?.createdBy))).map(
                (creator, n) => (
                  <MenuItem key={creator + n} value={creator}>
                    {creator}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        )}
        <FormControl size="small" sx={{ width: '50%' }}>
          <InputLabel sx={{ backgroundColor: 'background.paper' }}>
            Tags
          </InputLabel>
          <Select
            multiple
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            {Array.from(new Set(rows.flatMap((row) => row?.tags))).map(
              (tag, n) => (
                <MenuItem key={tag + n} value={tag}>
                  <Checkbox checked={tagFilter.includes(tag)} />
                  <ListItemText primary={tag} />
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'space-between',
            py: 2,
            backgroundColor: 'primary.main',
            width: '100%',
            zIndex: '5',
            mb: 1,
            color: 'black',
          }}
        >
          <Box
            sx={{
              width: '60%',
              fontWeight: 'bold',
              px: 1,
              textAlign: 'start',
            }}
          >
            Name
          </Box>
          <Box
            sx={{
              width: '40%',
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
      <Box sx={{ scrollbarWidth: 'none' }} aria-label="attributes table">
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
      {checkbox && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Button onClick={onConfirm}>Confirm</Button>
        </Box>
      )}
    </TableContainer>
  );
};

export default TableList;
