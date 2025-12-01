import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import useGlossaryManager from '@/hooks/glossary/useGlossaryManager.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { ArrowBack } from '@mui/icons-material';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import GlossarySidePanelWrapper from './GlossarySidePanelWrapper.js';

const glossaryNavItems = [
  'Overview',
  'Graph',
  'Entries',
  'Entry Types',
  'Calendar',
  'Settings',
  'Palette',
];

const NavList = () => {
  const { updateActiveTab, ui } = useGlossaryEditor();

  const { deselectGlossary, glossary } = useGlossaryManager();
  const activeIndex = glossaryNavItems.indexOf(ui?.activeTab || 'Overview');
  const { getAlphaColor, darkenColor } = useTheming();

  function getTop(index: number): string {
    return `${index * 44.5}px`;
  }

  const handleListItemClick = (item: string) => {
    updateActiveTab(item);
  };

  console.log(ui.activeTab === 'Graph');

  return (
    <GlossarySidePanelWrapper>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          onClick={deselectGlossary}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          {glossary?.name}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'relative',
          mt: 4,
        }}
      >
        {glossaryNavItems.map((item: string) => (
          <Button
            key={item}
            variant="text"
            sx={{
              justifyContent: 'flex-start',
              backgroundColor:
                ui.activeTab === item
                  ? getAlphaColor({
                      color: 'success',
                      key: 'dark',
                      opacity: 0.3,
                    })
                  : 'inherit',
              color: ui.activeTab === item ? 'success.main' : 'primary.main',
              '&:hover': {
                backgroundColor:
                  ui.activeTab !== item
                    ? darkenColor({
                        color: 'background',
                        key: 'default',
                        amount: 0.2,
                      })
                    : undefined,
                color: 'text.primary',
              },
            }}
            onClick={() => {
              handleListItemClick(item);
            }}
          >
            {item}
          </Button>
        ))}
        <Box
          component="span"
          sx={{
            position: 'absolute',
            left: 0,
            top: getTop(activeIndex),
            width: '2px',
            height: '36.5px',
            backgroundColor: getAlphaColor({
              color: 'success',
              key: 'light',
              opacity: 0.8,
            }),
            transition: 'top 0.3s ease',
          }}
        />
      </Box>
    </GlossarySidePanelWrapper>
  );
};

export default NavList;
