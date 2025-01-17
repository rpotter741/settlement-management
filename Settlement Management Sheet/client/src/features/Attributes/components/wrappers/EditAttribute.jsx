import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, Divider } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import AttrMetaData from '../forms/AttrMetaData.jsx';
import AttrValues from '../forms/AttrValues.jsx';
import SettlementPointsCost from '../forms/SettlementPointsCost.jsx';
import AttributeThresholds from '../forms/AttributeThresholds.jsx';
import TagTable from '../forms/TagTable';

const EditAttribute = ({ setShowModal }) => {
  const attr = useSelector((state) => state.attributes.edit);
  const [values, setValues] = useState(false);
  const [thresholds, setThresholds] = useState(false);
  const [tags, setTags] = useState(false);
  const [spCosts, setSpCosts] = useState(false);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'center',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
      }}
    >
      <AttrMetaData setShowModal={setShowModal} />
      <Divider sx={{ gridColumn: 'span 3' }} />
      <TitledCollapse
        title="Values"
        titleType="h6"
        defaultState={values}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{
          gridColumn: 'span 3',
        }}
        noDefaultHandler={() => setValues(!values)}
      >
        <AttrValues values={values} />
      </TitledCollapse>
      <TitledCollapse
        title="Settlement Point Costs"
        titleType="h6"
        defaultState={spCosts}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setSpCosts(!spCosts)}
      >
        <SettlementPointsCost />
      </TitledCollapse>
      <TitledCollapse
        title="Thresholds"
        titleType="h6"
        defaultState={thresholds}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setThresholds(!thresholds)}
      >
        <AttributeThresholds />
      </TitledCollapse>
      <TitledCollapse
        title={`Tags (${attr.tags?.length} / 5)`}
        titleType="h6"
        defaultState={tags}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setTags(!tags)}
      >
        <TagTable attr={attr} />
      </TitledCollapse>
    </Box>
  );
};

export default EditAttribute;
