import {
  ClickAwayListener,
  Grow,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';

interface BaseMenuProps {
  openMenu: HTMLElement | null;
  handleClose: (key?: string) => void;
  closeKey?: string;
  children: React.ReactNode;
}

const BaseMenu = ({
  openMenu,
  handleClose,
  closeKey,
  children,
}: BaseMenuProps) => {
  console.log('Rendering BaseMenu');
  const closeMenu = () => {
    closeKey ? handleClose(closeKey) : handleClose();
  };
  return (
    <Popper
      sx={{
        boxShadow: '2px 2px 10px 2px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        // minWidth: '200px',
        zIndex: 1300, // Ensure it appears above other elements
      }}
      open={Boolean(openMenu)}
      anchorEl={openMenu}
      placement="bottom-start"
      transition
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom-start' ? 'left top' : 'left bottom',
          }}
          timeout={100}
        >
          <Paper>
            <ClickAwayListener onClickAway={() => closeMenu()}>
              <MenuList disablePadding sx={{ p: 1 }}>
                {children}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default BaseMenu;
