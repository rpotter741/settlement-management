import React, { useState } from 'react';

import { Box, Divider } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import AttrMetaData from '../forms/AttrMetaData.jsx';
import AttrValues from '../forms/AttrValues.jsx';
import SettlementPointsCost from '../forms/SPC.jsx';
import ObjectThresholds from 'components/shared/Metadata/Thresholds.jsx';
import TagTable from '../forms/TagTable';

import { useTools } from 'hooks/useTool.tsx';
import { useToolContext } from 'context/ToolContext.jsx';
import { useSidePanel } from 'hooks/useSidePanel.jsx';

const EditAttribute = ({ setModalContent }) => {
  const { isSplit } = useSidePanel();
  const { id } = useToolContext();
  const { edit: attr } = useTools('attribute', id);
  const [values, setValues] = useState(false);
  const [thresholds, setThresholds] = useState(false);
  const [tags, setTags] = useState(false);
  const [spCosts, setSpCosts] = useState(false);

  const columns = isSplit ? 1 : 3;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr', `repeat(${columns}, 1fr)`],
        gridTemplateRows: 'auto',
        alignItems: 'start',
        justifyContent: 'start',
        my: 2,
        gap: 2,
        backgroundColor: 'background.paper',
        width: '100%',
        position: 'relative',
        // pb: 4,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <AttrMetaData setModalContent={setModalContent} id={id} />
      <Divider sx={{ gridColumn: 'span 3' }} />
      <TitledCollapse
        title="Values"
        titleType="h6"
        defaultState={values}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{
          gridColumn: `span ${columns}`,
        }}
        noDefaultHandler={() => setValues(!values)}
      >
        <AttrValues values={values} id={id} columns={columns} />
      </TitledCollapse>
      <TitledCollapse
        title="Settlement Point Costs"
        titleType="h6"
        defaultState={spCosts}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setSpCosts(!spCosts)}
      >
        <SettlementPointsCost id={id} />
      </TitledCollapse>
      <TitledCollapse
        title="Thresholds"
        titleType="h6"
        defaultState={thresholds}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        noDefaultHandler={() => setThresholds(!thresholds)}
      >
        <ObjectThresholds tool="attribute" id={id} />
      </TitledCollapse>
      <TitledCollapse
        title={`Tags (${attr?.tags?.length} / 5)`}
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
