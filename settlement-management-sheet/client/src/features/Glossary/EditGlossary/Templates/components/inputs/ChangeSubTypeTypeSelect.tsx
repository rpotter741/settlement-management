import { dispatch } from '@/app/constants.js';
import { selectSubTypeById } from '@/app/selectors/subTypeSelectors.js';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';
import { glossaryEntryTypeOptions } from '../../../../../../../../shared/types/index.js';
import capitalize from '@/utility/inputs/capitalize.js';

const ChangeSubTypeTypeSelect = ({
  disabled,
  editId,
}: {
  disabled: boolean;
  editId?: string | null;
}) => {
  const subtype = useSelector(selectSubTypeById(editId || ''));
  const { entryType } = subtype ? subtype : { entryType: '' };

  if (!subtype) return null;

  const entryTypeList = glossaryEntryTypeOptions.map((option) => ({
    value: option,
    label: capitalize(option),
  }));

  return (
    <FormControl fullWidth sx={{ maxWidth: 350 }}>
      <InputLabel id="change-subtype-type-label">Entry Type</InputLabel>
      <Select
        disabled={disabled}
        labelId="change-subtype-type-label"
        value={entryType}
        label="Sub-Type"
        onChange={(e) => {}}
        renderValue={(selected) => {
          const selectedOption = entryTypeList.find(
            (st) => st.value === selected
          );
          return selectedOption ? selectedOption.label : 'Select Sub-Type';
        }}
      >
        {entryTypeList.map((st) => (
          <MenuItem key={st.value} value={st.value}>
            {st.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ChangeSubTypeTypeSelect;
