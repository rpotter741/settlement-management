import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {
  GlossaryEntryType,
  glossaryEntryTypeOptions,
} from '../../../../../../../../shared/types/glossaryEntry.js';
import updateSubTypeEntryTypeThunk from '@/app/thunks/glossary/subtypes/updateSubTypeEntryTypeThunk.js';

const SubTypeEntryType = ({
  subType,
  subTypeId,
  getPropertyLabel,
}: {
  subType: any;
  subTypeId: string | null;
  getPropertyLabel: (entryType: GlossaryEntryType) => {
    label: string;
    defaultLabel: string;
  };
}) => {
  return (
    <FormControl sx={{ width: '50%' }}>
      <InputLabel id="entry-type-label">Entry Type</InputLabel>
      <Select
        labelId="entry-type-label"
        sx={{ width: '100%' }}
        value={subType.entryType}
        onChange={(e) => {
          updateSubTypeEntryTypeThunk({
            subTypeId: subTypeId!,
            entryType: e.target.value as GlossaryEntryType,
            system: subType.system,
          });
        }}
        label="Entry Type"
      >
        {glossaryEntryTypeOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {getPropertyLabel(option).label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SubTypeEntryType;
