import React, { useState, useEffect, useCallback } from 'react';

import { Box, Typography, Button, Tooltip, IconButton } from '@mui/material';
import { useModalActions } from '@/hooks/global/useModal.js';
import { AppDispatch } from '@/app/store.js';
import { useDispatch } from 'react-redux';
import thunks from '@/app/thunks/glossaryThunks.js';
import { GlossaryNode } from 'types/index.js';
import { usePropertyLabel } from '../utils/getPropertyLabel.js';
import { Close } from '@mui/icons-material';

interface ConfirmDeleteProps {
  nodes: GlossaryNode[];
  glossaryId: string;
}

const ConfirmDeleteEntries: React.FC<ConfirmDeleteProps> = ({
  nodes,
  glossaryId,
}) => {
  const { closeModal } = useModalActions();
  const dispatch: AppDispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [trueNodes, setTrueNodes] = useState<GlossaryNode[]>(nodes);
  const [plurality, setPlurality] = useState<boolean>(nodes.length > 1);

  const onDelete = () => {
    trueNodes.forEach((node) => {
      dispatch(
        thunks.deleteEntry({
          node,
        })
      );
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 1500); // Disable after 5 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  });

  useEffect(() => {
    if (trueNodes.length === 0) {
      closeModal();
    }
  }, [trueNodes, closeModal]);

  useEffect(() => {
    setPlurality(trueNodes.length > 1);
  }, [trueNodes]);

  const { getPropertyLabel } = usePropertyLabel();
  const printLabels = useCallback(() => {
    const labels = [
      'continent',
      'region',
      'territory',
      'nation',
      'landmark',
      'settlement',
      'collective',
    ];
    return labels
      .map((label) => getPropertyLabel('system', label))
      .map((tuple) => tuple.label)
      .join(' / ');
  }, [getPropertyLabel]);

  return (
    <>
      <Typography variant="h6" color="error.main" gutterBottom>
        Confirm Deletion
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to delete the following{' '}
        {plurality ? 'entries' : 'entry'}? If {plurality ? 'any are' : 'it is'}{' '}
        a{' '}
        <Tooltip
          title={<Typography>{printLabels()}</Typography>}
          arrow
          placement="top"
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 'bold',
              color: 'info.main',
              cursor: 'pointer',
            }}
          >
            section
          </Typography>
        </Tooltip>
        ,{' '}
        <strong>
          all of {plurality ? 'their' : 'its'} contents will also be deleted.
        </strong>
      </Typography>
      {trueNodes.map((n, index) => (
        <Box
          key={n.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: 3,
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              const newNodes = [...trueNodes];
              newNodes.splice(index, 1);
              setTrueNodes(newNodes);
            }}
          >
            <Close />
          </IconButton>
          <Typography key={n.id} variant="body2">
            {n.name}
          </Typography>
        </Box>
      ))}
      <Typography
        variant="body1"
        color="error.main"
        gutterBottom
        sx={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: 1 }}
      >
        THIS ACTION CANNOT BE UNDONE.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" color="primary" onClick={() => closeModal()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            onDelete();
            closeModal();
          }}
          disabled={disabled}
        >
          Delete
        </Button>
      </Box>
    </>
  );
};

export default ConfirmDeleteEntries;
