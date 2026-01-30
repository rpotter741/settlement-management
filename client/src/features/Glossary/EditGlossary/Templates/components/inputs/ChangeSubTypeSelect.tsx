import { dispatch } from '@/app/constants.js';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import changeEntrySubTypeThunk from '@/app/thunks/glossary/entries/changeEntrySubTypeThunk.js';
import { useShellContext } from '@/context/ShellContext.js';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useMemo } from 'react';
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
    console.log('Pushing subtype change to ', newSubTypeId);
    dispatch(
      changeEntrySubTypeThunk({
        glossaryId,
        newSubTypeId,
        entryId: source.id,
      })
    );
  };

  const value = useMemo(() => {
    return (
      filteredSubTypes.find((st) => st.id === (source?.subTypeId || editId)) ||
      null
    );
  }, [filteredSubTypes, source?.subTypeId, editId]);

  // gonna have to split by user and system here

  return (
    <Autocomplete
      disabled={disabled}
      options={filteredSubTypes}
      getOptionLabel={(option) =>
        `${option.name} (${option.source.slice(0, 1).toUpperCase()})`
      }
      value={value}
      onChange={(_, newValue) => {
        if (newValue) {
          pushSubTypeChange(newValue.id);
        }
      }}
      renderInput={(params) => (
        <FormControl fullWidth>
          <InputLabel id="change-subtype-label">Sub-Type</InputLabel>
          <div ref={params.InputProps.ref}>
            <input
              {...params.inputProps}
              style={{
                width: '100%',
                padding: '10px',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </FormControl>
      )}
      groupBy={(option) => option.source}
    />
    // <FormControl fullWidth>
    //   <InputLabel id="change-subtype-label">Sub-Type</InputLabel>
    //   <Select
    //     disabled={disabled}
    //     labelId="change-subtype-label"
    //     value={(source?.subTypeId || editId) ?? ''}
    //     label="Sub-Type"
    //     onChange={(e) => pushSubTypeChange(e.target.value)}
    //     renderValue={(selected) => {
    //       const selectedOption = filteredSubTypes.find(
    //         (st) => st.id === selected
    //       );
    //       const renderedText = selectedOption
    //         ? `${selectedOption.name} (${selectedOption.source.slice(0, 1).toUpperCase()})`
    //         : 'Select Sub-Type';
    //       return renderedText;
    //     }}
    //   >
    //     {filteredSubTypes.map((st) => (
    //       <MenuItem key={st.id} value={st.id}>
    //         {st.name}
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </FormControl>
  );
};

export default ChangeSubTypeSelect;
