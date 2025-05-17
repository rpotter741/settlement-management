import React, { useState, useEffect } from 'react';
import queryClient from 'context/QueryClient.js';
import usePaginatedTool from 'services/usePaginatedTool.js';
import { useTools } from 'hooks/useTool.tsx';

import capitalize from 'utility/capitalize.js';

import TitledCollapse from 'components/shared/TitledCollapse/TitledCollapse.jsx';
import TableList from 'components/shared/TableList/SmallTableList.jsx';

const FetchedDisplay = ({
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
  const { selectValue } = useTools(tool);
  const depId = selectValue('refId');
  const [myTools, setMyTools] = useState(isOpen);
  const [myData, setMyData] = useState([]);
  const [search, setSearch] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedTool({
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
    <TitledCollapse
      title={
        type === 'personal' ? `My ${displayName}` : `Community ${displayName}`
      }
      titleType="body2"
      defaultState={myTools}
      styles={{ width: '100%', mb: 2, px: 2 }}
      titleSx={{
        color: 'secondary.light',
        textAlign: 'center',
        fontSize: '1rem',
      }}
      noDefaultHandler={() => setMyTools(!myTools)}
    >
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
    </TitledCollapse>
  );
};

export default FetchedDisplay;
