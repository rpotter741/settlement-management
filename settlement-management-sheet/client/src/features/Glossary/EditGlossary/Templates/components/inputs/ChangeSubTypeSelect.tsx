import { dispatch } from '@/app/constants.js';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import changeEntrySubTypeThunk from '@/app/thunks/glossary/entries/changeEntrySubTypeThunk.js';
import { useShellContext } from '@/context/ShellContext.js';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useSelector } from 'react-redux';

const ChangeSubTypeSelect = ({
  disabled,
  editId,
}: {
  disabled: boolean;
  editId?: string | null;
}) => {
  //
  const { source, glossaryId } = useShellContext();
  const allSubTypes = useSelector(selectAllSubTypes);
  const filteredSubTypes = allSubTypes.filter(
    (st) => st.entryType === source?.entryType
  );

  const pushSubTypeChange = (newSubTypeId: string) => {
    console.log(glossaryId, newSubTypeId, editId);
    dispatch(
      changeEntrySubTypeThunk({
        glossaryId,
        newSubTypeId,
        entryId: source.id,
      })
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="change-subtype-label">Sub-Type</InputLabel>
      <Select
        disabled={disabled}
        labelId="change-subtype-label"
        value={(source?.subTypeId || editId) ?? ''}
        label="Sub-Type"
        onChange={(e) => pushSubTypeChange(e.target.value)}
        renderValue={(selected) => {
          const selectedOption = filteredSubTypes.find(
            (st) => st.id === selected
          );
          return selectedOption ? selectedOption.name : 'Select Sub-Type';
        }}
      >
        {filteredSubTypes.map((st) => (
          <MenuItem key={st.id} value={st.id}>
            {st.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ChangeSubTypeSelect;
