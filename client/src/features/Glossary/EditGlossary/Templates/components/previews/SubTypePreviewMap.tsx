import { Box } from '@mui/material';
import SubTypeCheckBoxPreview from './SubTypeCheckboxPreview.js';
import SubTypeCompoundPreview from './SubTypeCompoundPreview.js';
import SubTypeDropdownPreview from './SubTypeDropdownPreview.js';
import SubTypeRangePreview from './SubTypeRangePreview.js';
import SubTypeTextPreview from './SubTypeTextPreview.js';

const BrokenDateBox = () => {
  return <Box>Unimplemented Date Input</Box>;
};

const subTypePreviewMap: { [key: string]: React.ComponentType<any> } = {
  dropdown: SubTypeDropdownPreview,
  text: SubTypeTextPreview,
  checkbox: SubTypeCheckBoxPreview,
  compound: SubTypeCompoundPreview,
  range: SubTypeRangePreview,
  date: BrokenDateBox,
  // Add other sub-type previews as needed
};

export default subTypePreviewMap;
