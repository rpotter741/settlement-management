import React, { useState, useEffect, useRef } from 'react';

import TablePaginationActions from './TablePaginationActions.jsx';

import ActionsButton from './ActionsButton.jsx';

import InfiniteScrollActions from './InfiniteScrollActions.jsx';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Box,
  TableFooter,
  Typography,
} from '@mui/material';

const TableList = ({
  rows,
  type,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onSearch,
  onActionClick,
  infiniteScroll = true,
}) => {
  console.log(rows, 'rows baby');
  // infinite scroll and react query
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '5px', threshold: 0.1 } // Root is viewport, margin triggers early
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, loadMoreRef]);

  // search and filter
  const [search, setSearch] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [tagFilter, setTagFilter] = useState([]);
  // sort and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(infiniteScroll ? -1 : 10);
  // detail view, baby!
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const filteredRows = (rows || [])
    .flat()
    .filter(
      (row) =>
        row?.name?.toLowerCase().includes(search.toLowerCase()) &&
        (contentTypeFilter ? row.contentType === contentTypeFilter : true) &&
        (statusFilter ? row.status === statusFilter : true) &&
        (createdByFilter ? row.createdBy === createdByFilter : true) &&
        (tagFilter.length > 0
          ? tagFilter.every((tag) => row.tags.includes(tag))
          : true)
    );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: infiniteScroll ? '500px' : 'auto',
        overflowY: 'auto',
        minHeight: '350px',
        position: 'relative',
      }}
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
        <TableBody sx={{ '&:last-child': { borderBottom: 'none' } }}>
          {filteredRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No results found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            (rowsPerPage > 0
              ? filteredRows.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : filteredRows
            ).map((row) => (
              <>
                <TableRow
                  key={row.id}
                  onClick={() => toggleExpand(row.refId)}
                  sx={{
                    borderBottom: '1px solid',
                    cursor: 'pointer',
                    borderColor: 'secondary.main',
                    '&:hover': { backgroundColor: 'background.default' },
                    zIndex: 1,
                    position: 'relative',
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TableCell
                    sx={{ width: type === 'community' ? '26.667%' : '40%' }}
                  >
                    {row.name || '(Unnamed)'}
                  </TableCell>
                  {type === 'community' && (
                    <TableCell align="left" sx={{ width: '26.667%' }}>
                      {row.createdBy}
                    </TableCell>
                  )}
                  {type === 'community' && (
                    <TableCell align="left" sx={{ width: '26.667%' }}>
                      {row.contentType}
                    </TableCell>
                  )}
                  {type === 'personal' && (
                    <TableCell align="left" sx={{ width: '40%' }}>
                      {row.status}
                    </TableCell>
                  )}
                  <TableCell
                    align="left"
                    sx={{
                      width: '20%',
                      display: 'flex',
                    }}
                  >
                    <ActionsButton
                      onActionClick={onActionClick}
                      refId={row.refId}
                      id={row.id}
                    />
                  </TableCell>
                </TableRow>
                {expandedRow === row.refId && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'background.default',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2">
                          {row.description}
                        </Typography>
                        <Typography variant="caption">
                          Tags: {row.tags.join(', ')}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
          <TableRow ref={loadMoreRef}>
            {isFetchingNextPage && (
              <TableCell colSpan={6}>Loading...</TableCell>
            )}
            <TableCell colSpan={6} align="center">
              {' '}
              End of the List!{' '}
            </TableCell>
          </TableRow>
          {emptyRows > 0 && (
            <TableRow
              style={{
                height: 53 * emptyRows,
              }}
            >
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {infiniteScroll ? null : (
            <TablePagination
              rowsPerPageOptions={[5]}
              component="div"
              count={rows.length}
              rowsPerPage={5}
              page={page}
              slotProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          )}
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default TableList;
