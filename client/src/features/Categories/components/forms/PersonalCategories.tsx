import React, { useState, useEffect } from 'react';
import queryClient from 'context/QueryClient.js';
import getAttributes from '../../helpers/getAttributesAPI.js';

import TitledCollapse from 'components/shared/TitledCollapse/TitledCollapse.jsx';
import TableList from 'components/shared/TableList/TableList.jsx';

const PersonalAttributes = ({ onActionClick, options }) => {
  const [myTools, setMyTools] = useState(true);
  const [myData, setMyData] = useState([]);
  const [search, setSearch] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getAttributes('personal', search);

  useEffect(() => {
    const cachedData = queryClient.getQueryData([
      'attributes',
      'personal',
      search,
    ]);

    if (!cachedData) return;

    setMyData(cachedData);
  }, []);

  useEffect(() => {
    if (data) {
      setMyData(data.pages.flatMap((page) => page.items));
    }
  }, [data]);

  return (
    <TitledCollapse
      title="My Attributes"
      titleType="h5"
      open={myTools}
      styles={{ width: '100%', mb: 2 }}
      titleSx={{ color: 'secondary.light', textAlign: 'center' }}
      toggleOpen={() => setMyTools(!myTools)}
    >
      <TableList
        options={options}
        rows={myData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onSearch={setSearch}
        onActionClick={onActionClick}
        type="personal"
      />
    </TitledCollapse>
  );
};

export default PersonalAttributes;
