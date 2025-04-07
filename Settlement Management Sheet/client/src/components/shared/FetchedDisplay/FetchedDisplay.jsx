import React, { useState, useEffect } from 'react';
import queryClient from 'context/QueryClient.js';
import usePaginatedTool from 'services/usePaginatedTool.js';

import capitalize from 'utility/capitalize.js';

import TitledCollapse from 'components/shared/TitledCollapse/TitledCollapse.jsx';
import TableListTest from 'components/shared/TableList/TableListTest.jsx';

const FetchedDisplay = ({ onActionClick, options, type, tool }) => {
  const [myTools, setMyTools] = useState(true);
  const [myData, setMyData] = useState([]);
  const [search, setSearch] = useState('');
  const [displayName, setDisplayName] = useState(capitalize(tool));

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedTool({
      tool: tool,
      type: type,
      search,
    });

  useEffect(() => {
    const cachedData = queryClient.getQueryData([tool, type, search]);

    if (data) {
      setMyData(data.pages.flatMap((page) => page.items));
    } else if (cachedData) {
      setMyData(cachedData.pages.flatMap((page) => page.items));
    }
  }, [data, type, search]);

  return (
    <TitledCollapse
      title={
        type === 'personal' ? `My ${displayName}` : `Community ${displayName}`
      }
      titleType="h5"
      defaultState={myTools}
      styles={{ width: '100%', mb: 2 }}
      titleSx={{ color: 'secondary.light', textAlign: 'center' }}
      noDefaultHandler={() => setMyTools(!myTools)}
    >
      <TableListTest
        options={options}
        rows={myData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onSearch={setSearch}
        onActionClick={onActionClick}
        type={type}
      />
    </TitledCollapse>
  );
};

export default FetchedDisplay;
