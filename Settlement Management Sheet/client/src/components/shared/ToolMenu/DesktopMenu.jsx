import React from 'react';

import { Box, Button, Tooltip, Typography } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import LoadIcon from '@mui/icons-material/GetApp';

const DesktopMenu = ({ mode, tool, isValid, actions, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        mb: 2,
        ...props.sx,
      }}
    >
      {mode && (
        <>
          <Tooltip
            arrow
            title={<Typography variant="body2">Save changes</Typography>}
          >
            <Box>
              <Button onClick={actions.save} startIcon={<SaveIcon />}>
                Save Changes
              </Button>
            </Box>
          </Tooltip>

          <Tooltip
            arrow
            title={<Typography variant="body2">Cancel all changes</Typography>}
          >
            <Box>
              <Button onClick={actions.cancel} startIcon={<CancelIcon />}>
                Cancel Changes
              </Button>
            </Box>
          </Tooltip>
        </>
      )}
      {!mode && (
        <>
          <Tooltip
            arrow
            title={
              <Typography variant="body2">Edit the current {tool}</Typography>
            }
          >
            <Box>
              <Button onClick={actions.edit} startIcon={<EditIcon />}>
                Edit {tool}
              </Button>
            </Box>
          </Tooltip>

          <Tooltip
            arrow
            title={
              <Typography variant="body2">
                Load a new {tool} to view or edit
              </Typography>
            }
          >
            <Box>
              <Button
                onClick={actions.load}
                startIcon={<LoadIcon />}
                onMouseEnter={actions.loadHover}
              >
                Load {tool}
              </Button>
            </Box>
          </Tooltip>
        </>
      )}
      <Tooltip
        arrow
        title={
          isValid ? (
            <Typography variant="body2">Publish for others to use</Typography>
          ) : (
            <Typography variant="body2">
              All fields must be valid before publishing
            </Typography>
          )
        }
      >
        <Box>
          <Button
            disabled={!isValid}
            onClick={actions.publish}
            startIcon={<PublicIcon />}
          >
            Publish
          </Button>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default DesktopMenu;
