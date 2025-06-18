import React, { useEffect, useState } from 'react';

// redux
import initializeCategory from 'features/Categories/helpers/initializeCategory.js';
// custom components
import checklistContent from '../../helpers/checklistContent.js';
import EditCategory from './EditCategory.jsx';
import PreviewCategory from './PreviewCategory.jsx';
import LoadTool from 'components/shared/LoadTool/LoadTool.jsx';
import { useTools } from 'hooks/useTools.jsx';
import getNewDependencies from '@/features/Categories/helpers/alterDependencies.js';
import useFetchReferences from 'hooks/useFetchReferences.jsx';

import CreateShell from '@/components/shared/CreateShell/CreateToolShell.js';

const CreateCategory = ({ tab }) => {
  const { updateTool, edit } = useTools('category', tab.id);
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
      tab={tab}
      initializeTool={initializeCategory}
      validationFields={['name', 'description', 'thresholds', 'dependencies']}
      editComponent={EditCategory}
      previewComponent={PreviewCategory}
      checklistContent={checklistContent}
    />
  );
};

export default CreateCategory;
