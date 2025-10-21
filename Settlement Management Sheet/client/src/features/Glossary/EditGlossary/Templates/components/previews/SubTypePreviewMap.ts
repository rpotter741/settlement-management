import SubTypeCheckBoxPreview from './SubTypeCheckboxPreview.js';
import SubTypeCompoundPreview from './SubTypeCompoundPreview.js';
import SubTypeDropdownPreview from './SubTypeDropdownPreview.js';
import SubTypeRangePreview from './SubTypeRangePreview.js';
import SubTypeTextPreview from './SubTypeTextPreview.js';

const subTypePreviewMap: { [key: string]: React.ComponentType<any> } = {
  dropdown: SubTypeDropdownPreview,
  text: SubTypeTextPreview,
  checkbox: SubTypeCheckBoxPreview,
  compound: SubTypeCompoundPreview,
  range: SubTypeRangePreview,
  // Add other sub-type previews as needed
};

export default subTypePreviewMap;
