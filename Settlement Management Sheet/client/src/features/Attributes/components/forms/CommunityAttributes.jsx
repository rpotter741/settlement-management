import React, { useState, useEffect } from 'react';
import getAttributes from '../../helpers/getAttributesAPI.js';

import TitledCollapse from 'components/shared/TitledCollapse/TitledCollapse.jsx';
import TableList from 'components/shared/TableList/TableListTest.jsx';

const CommunityAttributes = ({ onActionClick, options }) => {
  const [search, setSearch] = useState('');
  const [myTools, setMyTools] = useState(true);
  const [communityData, setCommunityData] = useState([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    getAttributes('community', search);

  useEffect(() => {
    if (data) {
      setCommunityData(data.pages.flatMap((page) => page.items));
    }
  }, [data]);

  React.useEffect(() => {
    console.log(communityData);
  }, [communityData]);

  return (
    <TitledCollapse
      title="Community Attributes"
      titleType="h5"
      defaultState={myTools}
      styles={{ width: '100%', mb: 2 }}
      titleSx={{ color: 'secondary.light', textAlign: 'center' }}
      noDefaultHandler={() => setMyTools(!myTools)}
    >
      <TableList
        rows={communityData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onActionClick={onActionClick}
        type="community"
      />
    </TitledCollapse>
  );
};

export default CommunityAttributes;
