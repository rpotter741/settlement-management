import { SubType, SubTypePropertyTypes } from '@/app/slice/subTypeSlice.js';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SubTypeAnchorSelect = ({
  handleAnchorChange,
  subType,
  semanticAnchors,
  type,
}: {
  handleAnchorChange: (anchorId: string, type: 'primary' | 'secondary') => void;
  subType: SubType;
  semanticAnchors: {
    label: string;
    value: string;
    inputType: SubTypePropertyTypes;
    group: string;
  }[];
  type: 'primary' | 'secondary';
}) => {
  //
  return (
    <FormControl>
      <InputLabel id={`semantic-anchors-label-${type}`} size="small">
        {type === 'primary' ? 'Semantic Anchor 1' : 'Semantic Anchor 2'}
      </InputLabel>
      <Select
        sx={{
          width: [100, 200, 200, 350],
          textWrap: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          textAlign: 'start',
        }}
        size="small"
        onChange={(e) => handleAnchorChange(e.target.value as string, type)}
        value={subType.anchors[type] || ''}
        label={`Semantic Anchor ${type === 'primary' ? '1' : '2'}`}
      >
        {semanticAnchors.map((anchor) => (
          <MenuItem
            key={anchor.value}
            value={anchor.value}
            sx={{ textWrap: 'nowrap', textAlign: 'start' }}
          >
            {anchor.label} ( {anchor.group} )
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SubTypeAnchorSelect;
