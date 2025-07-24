import React, { useState, useEffect } from 'react';
import queryClient from 'context/QueryClient.js';
import services from '@/services/toolServices.js';
import { useTools } from 'hooks/tools/useTools.jsx';

import capitalize from '@/utility/inputs/capitalize.js';

import TableList from 'components/shared/TableList/SmallTableList.jsx';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const SidePanelFetchedDisplay = ({
  onActionClick,
  options,
  type,
  tool,
  selectionMode = false,
  maxSelections = 6,
  selected,
  setSelected,
  displayName = capitalize(tool),
  onConfirm = () => {},
  dependency = false,
  isOpen = true,
}) => {
  const { selectStaticValue } = useTools(tool);
  const depId = selectStaticValue('refId');
  const [myTools, setMyTools] = useState<boolean>(isOpen);
  const [myData, setMyData] = useState<any>([]);
  const [search, setSearch] = useState<string>('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    services.paginateToolContent({
      tool: tool,
      scope: type,
      search,
      dependency,
      depId,
    });

  useEffect(() => {
    const cachedData = queryClient.getQueryData([tool, type, search]);

    if (data) {
      setMyData(data.pages.flatMap((page) => page.items));
    } else if (cachedData) {
      setMyData(cachedData.pages.flatMap((page) => page.items));
    }
  }, [data, type, search]);

  const onDelete = async (e, id) => {
    e.stopPropagation();
    try {
      queryClient.setQueryData([tool, type, search], (oldData) => {
        return {
          ...oldData,
          items: oldData.items.filter((item) => item.refId !== id),
        };
      });
      setMyData((prev) => prev.filter((item) => item.refId !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Box sx={{ minWidth: ['100%'] }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {type === 'personal' ? `My ${displayName}` : `Community ${displayName}`}
      </Typography>
      <TableList
        options={options}
        rows={myData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onSearch={setSearch}
        onActionClick={onActionClick}
        onDelete={onDelete}
        type={type}
        checkbox={selectionMode}
        selected={selected}
        setSelected={setSelected}
        maxSelections={maxSelections}
        onConfirm={onConfirm}
      />
    </Box>
  );
};

export default SidePanelFetchedDisplay;
