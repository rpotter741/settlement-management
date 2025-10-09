import capitalize from '@/utility/inputs/capitalize.js';
import { EntriesViewerFilterEntry } from '../useEntriesViewer.js';
import { Autocomplete, Button, TextField } from '@mui/material';
import BaseMenu from '@/components/shared/Menu/BaseMenu.js';
import { useEffect, useState } from 'react';
import CheckButton from '@/components/shared/Menu/Buttons/CheckButton.js';
import LabelListCount from '@/components/shared/utility/LabelListCount.js';

interface EntryTypeFilterProps {
  options: { label: string; value: string }[];
  source: EntriesViewerFilterEntry[];
  onChange: (updates: any) => void;
  keyFilter: string;
  placeholder?: string;
}

const FilterMenu = ({
  options,
  source,
  onChange,
  keyFilter,
  placeholder,
}: EntryTypeFilterProps) => {
  const [openMenu, setOpenMenu] = useState<HTMLElement | null>(null);
  const [checklist, setChecklist] = useState<EntriesViewerFilterEntry[]>(
    source
      .filter((f: EntriesViewerFilterEntry) => f.key === keyFilter)
      .map((f: EntriesViewerFilterEntry) => ({
        label: capitalize(f.label as string),
        value: f.value as string,
        key: keyFilter,
      }))
  );

  useEffect(() => {
    console.log(checklist);
  }, [checklist]);

  function handleClick(item: { label: string; value: string }) {
    const isChecked = checklist.some((i) => i.value === item.value);
    const newChecklist = isChecked
      ? checklist.filter((i) => i.value !== item.value)
      : [
          ...checklist,
          {
            label: capitalize(item.label as string),
            value: item.value as string,
            key: keyFilter,
          },
        ];
    setChecklist(newChecklist);
    onChange({ filters: newChecklist });
  }

  return (
    <>
      <Button
        onClick={(e) => setOpenMenu(e.currentTarget)}
        sx={{ width: 200, position: 'relative' }}
      >
        <LabelListCount label={'Type Filters'} length={checklist.length} />
      </Button>
      <BaseMenu openMenu={openMenu} handleClose={() => setOpenMenu(null)}>
        {options.map((item: { label: string; value: string }) => (
          <CheckButton
            key={item.value}
            label={capitalize(item.label as string)}
            checked={checklist.some((i) => i.value === item.value)}
            onClick={() => handleClick(item)}
          />
        ))}
      </BaseMenu>
    </>
  );
};

export default FilterMenu;
