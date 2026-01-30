import { entryTypeIcons } from '@/features/Glossary/utils/glossaryConstants.js';
import useTheming from '@/hooks/layout/useTheming.js';
import { Box, Button, Typography } from '@mui/material';

const contentTypeMap: Record<'SYSTEM' | 'CUSTOM', string> = {
  SYSTEM: 'System',
  CUSTOM: 'Custom',
};

const SubTypeSelectButton = ({
  subType,
  editId,
  onClick,
}: {
  subType: any;
  editId: string | null;
  onClick: () => void;
}) => {
  const Icon = entryTypeIcons[subType.entryType];

  const { getAlphaColor } = useTheming();

  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        gap: 2,
        borderRadius: 1,
        backgroundColor:
          editId === subType.id
            ? getAlphaColor({
                color: 'success',
                key: 'light',
                opacity: 0.2,
              })
            : 'inherit',
        cursor: 'default',
      }}
      key={subType.id}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '10%' }}>
        {Icon}
      </Box>
      <Button
        variant="text"
        sx={{
          textTransform: 'none',
          textAlign: 'start',
          width: '60%',
          '&:hover': { backgroundColor: 'action.hover' },
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        <Typography
          sx={{ textAlign: 'start', width: '100%' }}
          variant="caption"
        >
          {subType.name}
        </Typography>
      </Button>
      <Box sx={{ width: '30%' }}>
        <Typography color="text.secondary" variant="caption">
          {subType.contentType === 'SYSTEM' ? 'System' : 'Custom'}
        </Typography>
      </Box>
    </Box>
  );
};

export default SubTypeSelectButton;
