import React, { useContext } from 'react';
import { ShellContext } from '@/context/ShellContext.js';
import { useTools } from '@/hooks/useTools.js';
import useAlphaColor from '@/hooks/layout/useAlphaColor.js';
import {
  Typography,
  Switch,
  Tooltip,
  useTheme,
  alpha,
  Button,
} from '@mui/material';
import useSharedHooks from '@/hooks/utility/useSharedHooks.js';
import { usePageBoxContext } from '@/context/PageBox.js';

interface ToolSwitchProps {
  keypath: string;
  trueLabel: string;
  falseLabel?: string;
  tooltip?: string;
  sx?: Record<string, any>;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  falseColor?: 'warning' | 'error' | 'info' | 'secondary' | 'primary';
  trueColor?: 'success' | 'info' | 'primary' | 'secondary';
  trueThemeKey?: 'main' | 'dark' | 'light';
  falseThemeKey?: 'main' | 'dark' | 'light';
  border?: boolean;
  variant?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  buttonType?: 'button' | 'switch';
  heightLock?: boolean;
}

const ToolSwitch: React.FC<ToolSwitchProps> = ({
  keypath,
  trueLabel = '',
  falseLabel = '',
  sx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    boxSizing: 'border-box',
    transition: 'background-color 0.3s ease, border-color 1s ease',
    borderLeft: '2px solid',
    pl: 2,
    py: 0.5,
    width: '100%',
    color: 'text.primary',
    borderRadius: 0,
  },
  tooltip,
  disabled = false,
  onChange,
  falseColor = 'warning',
  trueColor = 'success',
  trueThemeKey = 'main',
  falseThemeKey = 'main',
  border = true,
  variant = 'row',
  buttonType = 'button',
  heightLock = false,
}) => {
  const { tool, id } = useContext(ShellContext);
  const { updateTool, selectEditValue } = useTools(tool, id);
  const switchState = selectEditValue(keypath);
  const { utils } = useSharedHooks();
  const { lockHeight } = usePageBoxContext();

  const handleUpdate = () => {
    if (heightLock && switchState) {
      lockHeight();
    }
    updateTool(keypath, !switchState);
    if (typeof onChange === 'function') {
      onChange(!switchState);
    }
  };

  return (
    <Button
      tabIndex={-1}
      disableFocusRipple
      disabled={disabled}
      onClick={() => {
        if (buttonType === 'button') {
          handleUpdate();
        }
      }}
      sx={{
        ...sx,
        borderColor: switchState
          ? utils.color(trueColor, trueThemeKey, 0.5)
          : utils.color(falseColor, falseThemeKey, 0.5),
        '&:hover': {
          bgcolor: switchState
            ? utils.color(trueColor, trueThemeKey, 0.1)
            : utils.color(falseColor, falseThemeKey, 0.1),
        },
        borderLeft: border ? sx?.borderLeft : 'none',
        flexDirection: variant,
      }}
    >
      <Tooltip
        title={
          <Typography variant="body2">
            {tooltip || `Toggle ${keypath}`}
          </Typography>
        }
        placement="top"
        arrow
      >
        <Typography
          variant="body2"
          sx={{ flexGrow: 1, textAlign: 'left', textTransform: 'uppercase' }}
        >
          {switchState ? trueLabel : falseLabel ? falseLabel : trueLabel}
        </Typography>
      </Tooltip>
      <Switch
        id={`${tool}-${id}-${keypath}`}
        size="small"
        color={switchState ? trueColor : falseColor}
        checked={switchState === true}
        sx={{
          '& .MuiSwitch-switchBase': {
            '&.Mui-checked': {
              color: utils.color(trueColor, trueThemeKey, 0.8),
            },
            '&:not(.Mui-checked)': {
              color: utils.color(falseColor, falseThemeKey, 0.8),
            },
          },
          '& .MuiSwitch-track': {
            backgroundColor: utils.color('info', 'light', 1),
          },
        }}
        onClick={() => {
          if ((buttonType = 'switch')) {
            handleUpdate();
          }
        }}
      />
    </Button>
  );
};

export default ToolSwitch;
