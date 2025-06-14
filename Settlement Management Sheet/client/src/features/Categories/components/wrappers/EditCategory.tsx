import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTools } from 'hooks/useTools.jsx';
import { useShellContext } from '@/context/ShellContext.js';

import { Box, Divider } from '@mui/material';
import { TitledCollapse } from '../../../../components/index.js';
import EditNameDescription from 'components/shared/Metadata/EditNameDescription.jsx';
import ObjectThresholds from 'components/shared/Metadata/Thresholds.jsx';
import ObjectDependencies from 'components/shared/Metadata/Dependencies.jsx';

import categoryFields from '../../helpers/categoryFormData.js';
import CategoryAttributes from '../forms/CategoryAttributes.jsx';

const EditCategory = ({ setModalContent }) => {
  const { tool, id } = useShellContext();
  const { edit: category } = useTools(tool, id);
  const [attributes, setAttributes] = useState(false);
  const [thresholds, setThresholds] = useState(false);
  const [dependencies, setDependencies] = useState(false);
  const [tags, setTags] = useState(false);

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
        pb: 2,
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 200px)',
      }}
    >
      <EditNameDescription tool="category" fields={categoryFields} id={id} />
      <Divider sx={{ gridColumn: 'span 3' }} />
      <TitledCollapse
        title="Attributes"
        titleType="h6"
        open={attributes}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setAttributes(!attributes)}
      >
        <CategoryAttributes setModalContent={setModalContent} id={id} />
      </TitledCollapse>
      <TitledCollapse
        title="Thresholds"
        titleType="h6"
        open={thresholds}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setThresholds(!thresholds)}
      >
        <ObjectThresholds tool="category" id={id} />
      </TitledCollapse>
      <TitledCollapse
        title="Dependencies"
        titleType="h6"
        open={dependencies}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setDependencies(!dependencies)}
      >
        <ObjectDependencies
          tool="category"
          setModalContent={setModalContent}
          id={id}
          displayName="Categories"
        />
      </TitledCollapse>
      <TitledCollapse
        title="Tags"
        titleType="h6"
        open={tags}
        styles={{ width: '100%', mb: 2 }}
        boxSx={{ gridColumn: 'span 3' }}
        toggleOpen={() => setTags(!tags)}
      >
        tags
      </TitledCollapse>
    </Box>
  );
};

export default EditCategory;
