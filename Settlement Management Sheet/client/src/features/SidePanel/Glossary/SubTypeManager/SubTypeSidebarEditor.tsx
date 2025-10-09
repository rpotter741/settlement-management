import { selectSubTypeById } from '@/app/selectors/glossarySelectors.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

const SubTypeSidebarEditor = ({ subTypeId }: { subTypeId: string }) => {
  //
  const { glossary } = useGlossaryManager();
  const subType = useSelector(selectSubTypeById(glossary?.id || '', subTypeId));
  console.log(subType);
  return <Box>Yo, we in editing mode!</Box>;
};

export default SubTypeSidebarEditor;
