import React, { LazyExoticComponent, useState } from 'react';

import { Box, Divider } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';

import AttrMetaData from '../forms/AttrMetaData.jsx';
import AttrValues from '../forms/AttrValues.jsx';
import SettlementPointsCost from '../forms/SPC.jsx';
import ObjectThresholds from 'components/shared/Metadata/Thresholds.jsx';
import TagTable from '../forms/TagTable.jsx';

import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';
import { useSidePanel } from 'hooks/useSidePanel.jsx';
import GeographyForm from '@/features/Glossary/LandmarkForm/CreateLandmarkGlossary.js';

interface EditAttributeProps {}

const EditAttribute: React.FC<EditAttributeProps> = () => {
  const { isSplit } = useSidePanel();
  const { id } = useShellContext();
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
        width: '100%',
        position: 'relative',
        // pb: 4,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 125px)',
      }}
    >
      <AttrMetaData />
      <Divider sx={{ gridColumn: 'span 3' }} />
      <TitledCollapse
        title="Values"
        titleType="h6"
        open={values}
        styles={{ width: '100%', marginBottom: 2 }}
        boxSx={{
          gridColumn: `span 3`,
        }}
        toggleOpen={() => setValues(!values)}
      >
        <AttrValues columns={columns} />
      </TitledCollapse>
      <TitledCollapse
        title="Settlement Point Costs"
        titleType="h6"
        open={spCosts}
        styles={{ width: '100%', marginBottom: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setSpCosts(!spCosts)}
      >
        <SettlementPointsCost />
      </TitledCollapse>
      <TitledCollapse
        title="Thresholds"
        titleType="h6"
        open={thresholds}
        styles={{ width: '100%', marginBottom: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setThresholds(!thresholds)}
      >
        <ObjectThresholds />
      </TitledCollapse>
      <TitledCollapse
        title={`Tags (${attr?.tags?.length} / 5)`}
        titleType="h6"
        open={tags}
        styles={{ width: '100%', marginBottom: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setTags(!tags)}
      >
        <TagTable />
      </TitledCollapse>
    </Box>
  );
};

export default EditAttribute;
