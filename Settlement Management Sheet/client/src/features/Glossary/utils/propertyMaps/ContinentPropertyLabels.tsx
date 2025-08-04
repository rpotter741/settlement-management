import { Box } from '@mui/system';
import continentPropertyArrayMap from './fantasy/continent.js';
import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import getPropertyLabel, { SubSectionTypes } from '../getPropertyLabel.js';

const ContinentPropertyLabels = ({ glossary }) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          px: 2,
          // boxSizing: 'border-box',
        }}
      >
        <Box sx={{ width: '40%', flex: 4 }} className="filler" />
        <Typography
          variant="h6"
          sx={{ width: '20%', textAlign: 'center', flex: 2 }}
        >
          Enabled
        </Typography>
        <Box
          sx={{
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            flex: 4,
          }}
        >
          <Typography variant="h6" sx={{ width: '100%', textAlign: 'center' }}>
            Visibility
          </Typography>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Typography
              variant="body1"
              sx={{ width: '50%', textAlign: 'center' }}
            >
              Public
            </Typography>
            <Typography
              variant="body1"
              sx={{ width: '50%', textAlign: 'center' }}
            >
              Players
            </Typography>
          </Box>
        </Box>
      </Box>
      {continentPropertyArrayMap.map((section) => (
        <Box
          key={section.name}
          sx={{
            boxSizing: 'border-box',
            border: '1px solid #ccc',
            p: 2,
            borderCollapse: 'collapse',
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <Typography
              variant="h6"
              sx={{ mb: 1, width: '40%', textAlign: 'left' }}
            >
              {getPropertyLabel({
                glossary,
                section: section.name.toLowerCase() as SubSectionTypes,
                key: `${section.name} Name`,
              })}
            </Typography>
            <Box sx={{ width: '20%' }}>
              <Checkbox />
            </Box>
            <Box sx={{ width: '20%' }}>
              <Checkbox />
            </Box>
            <Box sx={{ width: '20%' }}>
              <Checkbox />
            </Box>
          </Box>
          <List>
            {section.children.map((child) => (
              <ListItem key={child.keypath} sx={{ display: 'flex', px: 0 }}>
                <ListItemText
                  primary={getPropertyLabel({
                    glossary,
                    key: child.keypath,
                    section: section.name.toLowerCase() as SubSectionTypes,
                  })}
                  secondary={`System Name: ${child.keypath}`}
                  sx={{ width: '40%' }}
                />
                <Box
                  sx={{
                    width: '20%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Checkbox />
                </Box>
                <Box
                  sx={{
                    width: '20%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Checkbox />
                </Box>
                <Box
                  sx={{
                    width: '20%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Checkbox />
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

export default ContinentPropertyLabels;
