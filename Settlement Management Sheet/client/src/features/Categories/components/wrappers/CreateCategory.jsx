import React, { useEffect, useState } from 'react';

// redux
import initializeCategory from 'features/Categories/helpers/initializeCategory.js';
// custom components
import checklistContent from '../../helpers/checklistContent.js';
import EditCategory from './EditCategory';
import PreviewCategory from './PreviewCategory.jsx';
import LoadTool from 'components/shared/LoadTool/LoadTool.jsx';
import { useTools } from 'hooks/useTool.jsx';
import getNewDependencies from 'utility/alterDependencies.js';
import useFetchReferences from 'hooks/useFetchReferences.jsx';

import CreateShell from 'components/shared/CreateShell/CreateShell.jsx';

const CreateCategory = ({ id }) => {
  const { updateTool, edit } = useTools('category', id);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (edit) {
      setSelected(edit?.dependencies?.order);
    }
  }, [edit?.dependencies?.order]);

  const handleDependencyChange = async (keypath, selected) => {
    const newDependencies = await getNewDependencies({
      edit,
      selected,
      tool: 'category',
    });
    updateTool('dependencies.data', newDependencies);
    updateTool('dependencies.order', selected.ids);
    updateTool('dependencies.refIds', selected.refIds);
  };

  return (
    <CreateShell
      tool="category"
      id={id}
      initializeTool={initializeCategory}
      validationFields={['name', 'description', 'thresholds', 'dependencies']}
      editComponent={EditCategory}
      previewComponent={PreviewCategory}
      checklistContent={checklistContent}
      loadDisplayName="Load Category"
      modalComponents={{
        'Select Attribute': LoadTool,
        'Select Category': LoadTool,
      }}
      modalComponentsProps={{
        'Select Attribute': {
          tool: 'attribute',
          displayName: 'Attributes',
          keypath: 'attributes',
          selectionMode: true,
          outerUpdate: updateTool,
          outerTool: edit,
        },
        'Select Category': {
          tool: 'category',
          displayName: 'Categories',
          keypath: 'dependencies.order',
          refKeypath: 'dependencies.refIds',
          selectionMode: true,
          outerUpdate: handleDependencyChange,
          outerTool: edit,
          dependency: true,
        },
      }}
    />
  );
};

export default CreateCategory;
