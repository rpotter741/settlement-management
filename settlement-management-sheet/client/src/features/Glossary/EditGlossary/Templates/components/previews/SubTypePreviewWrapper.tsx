import { Divider, Typography } from '@mui/material';

const SubTypePreviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Divider sx={{ width: '100%', my: 2 }} />
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Preview
      </Typography>
      <Divider sx={{ width: '50%', my: 2, transform: 'translateX(50%)' }} />
      {children}
    </>
  );
};

export default SubTypePreviewWrapper;
