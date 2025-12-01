import { selectGlossaryStructure } from '@/app/selectors/glossarySelectors.js';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { filterNodesByEntryType } from '../utils/glossaryConstants.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import isDetailFileType from '@/app/../../../server/src/utils/isDetailFileType.js';
import { v4 as newId } from 'uuid';
import { useEffect, useMemo, useState } from 'react';
import { usePropertyLabel } from '../utils/getPropertyLabel.js';
import { selectAllSubTypes } from '@/app/selectors/subTypeSelectors.js';
import { dispatch } from '@/app/constants.js';
import createAndAppendEntryThunk from '@/app/thunks/glossary/entries/createAndAppendEntry.js';
import { GlossaryEntryType } from '../../../../../shared/types/glossaryEntry.js';

const CreateGlossaryEntryFromDropdown = ({
  sourceId,
  keypath,
  property,
  glossaryId,
  newEntryName,
}: {
  sourceId: string;
  keypath: string;
  property: any;
  glossaryId: string;
  newEntryName: string;
}) => {
  const { getPropertyLabel } = usePropertyLabel();
  const { closeModal } = useModalActions();
  const allSubTypes = useSelector(selectAllSubTypes);

  const [name, setName] = useState<string>(newEntryName || 'Untitled');
  const [entryType, setEntryType] = useState<{ name: string; value: string }>({
    name: getPropertyLabel(property.relationship[0]).label ?? '',
    value: property.relationship[0],
  });
  const subTypeOptions = useMemo(() => {
    return [...allSubTypes]
      .filter((st: any) => st.entryType === entryType.value)
      .map((st: any) => ({
        name: st.name as string,
        value: st.id as string,
      }));
  }, [allSubTypes, entryType.value]);

  useEffect(() => {
    if (subTypeOptions.length > 0) {
      setSubType(subTypeOptions[0]);
    } else {
      setSubType(null);
    }
  }, [subTypeOptions]);

  const [parentId, setParentId] = useState<any | null>(null);
  const [newTab, setNewTab] = useState<boolean>(true);
  const [subType, setSubType] = useState<{
    name: string;
    value: string;
  } | null>(subTypeOptions[0] || null);

  const allNodes = useSelector(selectGlossaryStructure(glossaryId ?? '')) || [];
  const filteredNodes = useMemo(() => {
    return filterNodesByEntryType(allNodes, entryType.value).map((node) => ({
      value: node.id,
      name: node.name,
      entryType: node.entryType,
    }));
  }, [allNodes, entryType.value]);
  const options = [
    ...filteredNodes,
    { value: null, name: 'None', entryType: null },
  ];

  const handleCreateEntry = () => {
    if (!subType) return;
    const id = newId();
    const parent = parentId?.value;
    const node = {
      id,
      parentId: parent ?? null,
      name: name || 'Untitled',
      entryType: entryType.value as GlossaryEntryType,
      subTypeId: subType.value,
      glossaryId,
    };
    if (isDetailFileType(entryType.value)) {
      dispatch(
        createAndAppendEntryThunk({
          node: { ...node, fileType: 'detail' },
          sourceId,
          keypath,
          newTab,
        })
      );
    } else {
      dispatch(
        createAndAppendEntryThunk({
          node: { ...node, fileType: 'section' },
          sourceId,
          keypath,
          newTab,
        })
      );
    }
    closeModal();
  };

  /*
  Okay. We're going to enable the user to also select entry type based on relationships as though it were an array. Also means fixing the filter function with an array of subTypes. Once we have the nodes it can go into, we're going to build a thunk that's separate. It'll do the createSection / createDetail (which could probably be normalized too) and then we'll use the keypath to update the property value to the new entry's ID.

  We'll make sure we do all of the optimistic updates first, and then rollback will be a weird ugly thing but it shouldn't be too bad.

  Anyway, the thunk is going to have to take both the keypath and the source entry id so that it knows who and what to update. (Boom. added sourceId). From there it should be pretty easy.

  Here's another reminder to make the dropdowns be autocompletes for the dropdown previews, no matter if its list or entryType. Same with multi and single select. Preclude list options from being able to add their own options (which I think is already the case).

  We also need to add an editable textfield value for ranges so that the user can type in the value they want instead of dragging only. Also, include the option for a range to have a high and low value so it's actually, you know, a range.

  */

  return (
    <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
        Link New Glossary Entry
      </Typography>
      <TextField
        label="Entry Name"
        sx={{ width: '100%', mt: 2 }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Untitled"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
      />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <Autocomplete
          disabled={property.relationship.length <= 1}
          value={entryType}
          options={property.relationship.map((rel: string) => ({
            name: getPropertyLabel(rel).label || rel,
            value: rel,
          }))}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Entry Type" />}
          onChange={(event, newValue) => {
            setEntryType(newValue ? newValue : { name: '', value: '' });
          }}
          sx={{ flex: 1 }}
        />
        <Autocomplete
          value={subType}
          options={subTypeOptions}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Sub-Type" />}
          onChange={(event, newValue) => {
            setSubType(newValue ? newValue : null);
          }}
          sx={{ flex: 1 }}
        />
      </Box>
      <Autocomplete
        value={parentId}
        options={options}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="Parent Entry" />}
        onChange={(event, newValue) => {
          setParentId(newValue ? newValue : null);
        }}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 6,
          fontSize: '1.1rem',
        }}
      >
        <Typography variant="body1" fontSize="1.1rem">
          Open{' '}
          <Typography
            variant="body1"
            color="primary"
            component="span"
            fontSize="1.1rem"
          >
            {name || 'Untitled'}
          </Typography>{' '}
          in new tab?
        </Typography>
        <Checkbox
          color="success"
          checked={newTab}
          onChange={(e) => setNewTab(e.target.checked)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 4,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button
          color="primary"
          variant="contained"
          onClick={() => closeModal()}
        >
          Cancel
        </Button>
        <Button
          color="secondary"
          variant="contained"
          disabled={!entryType}
          onClick={() => handleCreateEntry()}
        >
          Create Entry
        </Button>
      </Box>
    </Box>
  );
};

export default CreateGlossaryEntryFromDropdown;
