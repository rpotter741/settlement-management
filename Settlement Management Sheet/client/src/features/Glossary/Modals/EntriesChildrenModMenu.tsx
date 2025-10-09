import { useModalActions } from '@/hooks/global/useModal.js';
import { Box, Button, Checkbox, Typography } from '@mui/material';
import { useState } from 'react';
import { GlossaryNode } from '../../../../../shared/types/glossaryEntry.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import { addData } from '@/app/slice/relaySlice.js';

interface EntriesChildrenModMenuProps {
  childrenArray: GlossaryNode[];
  preselected: string[];
  relayId: string;
}

const EntriesChildrenModMenu = ({
  childrenArray,
  preselected,
  relayId,
}: EntriesChildrenModMenuProps) => {
  //
  const dispatch: AppDispatch = useDispatch();

  const { closeModal } = useModalActions();
  const [selected, setSelected] = useState<number[]>(
    childrenArray.reduce((acc, curr, index) => {
      if (preselected.includes(curr.id)) acc.push(index);
      return acc;
    }, [])
  );

  const handleSelect = (index: number) => {
    const idx = selected?.indexOf(index);
    if (idx === -1) {
      setSelected((prev) => (prev ? [...prev, index] : [index]));
    } else {
      setSelected((prev) => (prev ? prev.filter((c) => c !== index) : []));
    }
  };

  const handleClose = () => {
    closeModal();
  };

  const handleSubmit = () => {
    const data = childrenArray.map((child, index) => {
      return {
        id: child.id,
        name: child.name,
        selected: selected.includes(index),
      };
    });
    dispatch(addData({ id: relayId, data }));
    closeModal();
  };

  return (
    <>
      {childrenArray.map((child: GlossaryNode, index: number) => (
        <Box
          sx={{ width: '300px', display: 'flex', alignItems: 'center', gap: 2 }}
          key={child.id}
        >
          <Checkbox
            checked={selected ? selected.includes(index) : false}
            onChange={() => handleSelect(index)}
          />
          <Typography>{child.name}</Typography>
        </Box>
      ))}
      <Box sx={{ display: 'flex' }}>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </Box>
    </>
  );
};

export default EntriesChildrenModMenu;
