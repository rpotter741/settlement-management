import EditFieldWithButton from '@/components/shared/Layout/EditFieldWithButton.js';
import { Edit, ExpandLess, ExpandMore, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const SubTypeSettings = ({
  subType,
  showModal,
}: {
  subType: any;
  showModal: any;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showPublication, setShowPublication] = useState(false);

  const handleDeleteSubType = () => {
    const entry = {
      id: 'delete-subtype-confirmation',
      componentKey: 'DeleteSubTypeConfirmation',
      props: { subType },
    };
    showModal({ entry });
  };

  console.log(subType);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 2,
      }}
    >
      <Divider />
      <Typography variant="h6" sx={{ mb: 2 }}>
        {`${subType?.name} Sub-Type Settings`}
      </Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Here you can configure various settings related to the sub-type.
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{
            position: 'absolute',
            left: 0,
            top: -4,
          }}
          onClick={() => setShowPublication(!showPublication)}
        >
          {!showPublication ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
        <Typography
          variant="h6"
          sx={{ mb: 1, width: '100%', textAlign: 'center' }}
        >
          Publication Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Collapse in={showPublication} timeout="auto" unmountOnExit>
          <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Published sub-types are visible to all users, while draft
              sub-types are only visible to editors.
            </Typography>
            <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
              <Typography variant="body1" sx={{ mb: 1, width: '75%' }}>
                Publication Status:
              </Typography>
              <Typography
                color="primary"
                fontWeight="bold"
                sx={{ width: '50%', textAlign: 'center' }}
              >
                {subType?.status}
              </Typography>
            </Box>

            {subType?.status === 'DRAFT' && (
              <Button variant="contained" color="primary">
                Publish Sub-Type
              </Button>
            )}
          </Box>
        </Collapse>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{
            position: 'absolute',
            left: 0,
            top: -4,
          }}
          onClick={() => setShowPricing(!showPricing)}
        >
          {!showPricing ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
        <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
          Pricing
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Collapse in={showPricing} timeout="auto" unmountOnExit>
        <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Before or after publishing, you can set a purchase price for the
            sub-type. This flags it as a premium sub-type and prevents others
            from cloning or forking it. If you do not set a price, it will be
            available for free.
          </Typography>
          <TextField
            type="number"
            disabled={!isEditing}
            label="Set Purchase Price"
            fullWidth
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                endAdornment: (
                  <IconButton onClick={() => setIsEditing(!isEditing)}>
                    {!isEditing ? <Edit /> : <Save />}
                  </IconButton>
                ),
              },
            }}
            placeholder="0.00"
            sx={{ mb: 2 }}
          />
        </Box>
      </Collapse>
      <Button variant="contained" color="warning" onClick={handleDeleteSubType}>
        Delete Sub-Type
      </Button>
    </Box>
  );
};

export default SubTypeSettings;
