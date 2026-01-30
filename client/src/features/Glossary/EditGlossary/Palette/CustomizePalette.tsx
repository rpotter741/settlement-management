import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useCallback, useEffect } from 'react';

import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  useTheme,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { TitledCollapse } from '@/components/index.js';
import { capitalize, set } from 'lodash';
import cssColorNameToHex from '@/utility/style/cssColorNameToHex.js';
import GlossaryMainWrapper from '../components/GlossaryMainWrapper.js';
import { useModalActions } from '@/hooks/global/useModal.js';
import { useDispatch } from 'react-redux';
import updateGlossaryThunk from '@/app/thunks/glossary/glossary/updateGlossaryThunk.js';
import { AppDispatch } from '@/app/store.js';
import { resetPalette } from '@/app/slice/glossarySlice.js';

interface ColorPickerProps {
  feature: string;
  sourceColor?: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  feature,
  sourceColor,
  onChange,
}) => {
  const [color, setColor] = useState<string>(
    sourceColor?.toUpperCase() || '#ffffff'
  );
  const [text, setText] = useState<string>(color.toUpperCase());
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const triggerShake = () => {
    setIsInvalid(true);
    setTimeout(() => {
      setIsInvalid(false);
    }, 300);
  };

  const convertStringToHex = (colorString: string) => {
    return cssColorNameToHex[colorString.toLowerCase()] || sourceColor;
  };

  const isValidColor = (str: string): boolean => {
    const s = new Option().style;
    s.color = str;
    return s.color !== '';
  };

  const handleChange = (colorChange: string) => {
    const newColor = colorChange.toUpperCase();
    if (!isValidColor(newColor)) {
      triggerShake();
      setText(color);
      return;
    }
    if (newColor.startsWith('#')) {
      setColor(newColor);
      onChange(newColor);
      setText(newColor);
    } else {
      const hex = convertStringToHex(newColor);
      if (!hex) return;
      setColor(hex);
      onChange(hex);
    }
  };

  const [editing, setEditing] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 2,
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">{feature}</Typography>
        <Box
          sx={{
            height: 20,
            width: 20,
            borderRadius: '50%',
            backgroundColor: color,
          }}
        />
      </Box>
      <Box className="color-picker-small">
        <HexColorPicker color={color} onChange={handleChange} />
      </Box>
      {editing ? (
        <TextField
          autoFocus
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditing(false);
              handleChange(text);
            }
            if (e.key === 'Escape') {
              setEditing(false);
              setText(color);
            }
          }}
          onBlur={() => {
            setEditing(false);
            handleChange(text);
          }}
          variant="standard"
        />
      ) : (
        <Typography
          className={isInvalid ? 'invalid-shake' : ''}
          sx={{ textDecoration: 'underline' }}
          onClick={() => setEditing(true)}
        >
          {color}
        </Typography>
      )}
    </Box>
  );
};

export type ThemeKeys =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'error'
  | 'info'
  | 'success'
  | 'background';

interface CustomizePaletteKeyProps {
  themeKey: ThemeKeys;
  open: boolean;
  toggleOpen?: () => void;
  updateColor?: (
    key: ThemeKeys,
    shade: 'light' | 'main' | 'dark',
    color: string
  ) => void;
  column?: boolean;
}

const getThemeKeyVariants = (themeKey: ThemeKeys) => {
  switch (themeKey) {
    case 'primary':
      return ['light', 'main', 'dark'];
    case 'secondary':
      return ['light', 'main', 'dark'];
    case 'warning':
      return ['light', 'main', 'dark'];
    case 'error':
      return ['light', 'main', 'dark'];
    case 'info':
      return ['light', 'main', 'dark'];
    case 'success':
      return ['light', 'main', 'dark'];
    case 'background':
      return ['paper', 'default'];
    default:
      return [];
  }
};

const CustomizePaletteKey: React.FC<CustomizePaletteKeyProps> = ({
  themeKey,
  open,
  toggleOpen = () => {},
  updateColor = () => {},
  column = false,
}) => {
  if (!themeKey) return null;
  const theme = useTheme();

  const handleColorChange = (shade: any) => (color: string) => {
    updateColor(themeKey, shade, color);
  };

  return (
    <TitledCollapse
      title={`${capitalize(themeKey)}`}
      toggleOpen={toggleOpen}
      open={open}
      width="100%"
      childContainerSx={{
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        justifyContent: 'space-around',
      }}
      styles={{ justifyContent: 'start', gap: 2 }}
    >
      {/* iterate through themeKeyVariants, which should have feature as title, source color as themeObj[variant], and handleColorChange(variant) */}
      {getThemeKeyVariants(themeKey).map((variant) => (
        <ColorPicker
          key={variant}
          feature={capitalize(variant)}
          //@ts-ignore
          sourceColor={theme.palette[themeKey][variant]}
          onChange={handleColorChange(variant)}
        />
      ))}
    </TitledCollapse>
  );
};

const defaultOpenState = {
  primary: false,
  secondary: false,
  warning: false,
  error: false,
  info: false,
  success: false,
};

export const defaultThemeState = (theme: any) => ({
  primary: {
    light: theme.palette.primary.light,
    main: theme.palette.primary.main,
    dark: theme.palette.primary.dark,
  },
  secondary: {
    light: theme.palette.secondary.light,
    main: theme.palette.secondary.main,
    dark: theme.palette.secondary.dark,
  },
  warning: {
    light: theme.palette.warning.light,
    main: theme.palette.warning.main,
    dark: theme.palette.warning.dark,
  },
  error: {
    light: theme.palette.error.light,
    main: theme.palette.error.main,
    dark: theme.palette.error.dark,
  },
  info: {
    light: theme.palette.info.light,
    main: theme.palette.info.main,
    dark: theme.palette.info.dark,
  },
  success: {
    light: theme.palette.success.light,
    main: theme.palette.success.main,
    dark: theme.palette.success.dark,
  },
  background: {
    paper: theme.palette.background.paper,
    default: theme.palette.background.default,
  },
});

const CustomizePalette = ({
  column,
  onChange,
  onReset,
  onSave,
}: {
  column: boolean;
  onChange: ({
    themeKey,
    shade,
    color,
  }: {
    themeKey: ThemeKeys;
    shade: 'light' | 'main' | 'dark' | 'paper' | 'default';
    color: string;
  }) => void;
  onReset: () => void;
  onSave: () => void;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const themeKeys: ThemeKeys[] = [
    'primary',
    'secondary',
    'warning',
    'error',
    'info',
    'success',
    'background',
  ];
  const [themeState, setThemeState] = useState(defaultThemeState(theme));
  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(defaultOpenState);

  const toggleSection = (key: string) => {
    setOpenSections({ ...defaultOpenState, [key]: !openSections[key] });
  };

  const updateColor = (
    key: ThemeKeys,
    shade: 'light' | 'main' | 'dark' | 'default' | 'paper',
    color: string
  ) => {
    setThemeState((prev) => ({
      ...prev,
      [key]: {
        // @ts-ignore
        ...prev[key],
        [shade]: color,
      },
    }));
    onChange({ themeKey: key, shade, color });
  };

  return (
    <GlossaryMainWrapper>
      <Box sx={{ width: '100%', p: 10, display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          {themeKeys.map((key) => (
            <CustomizePaletteKey
              key={key}
              themeKey={key}
              updateColor={updateColor}
              toggleOpen={() => toggleSection(key)}
              open={openSections[key]}
              column={column}
            />
          ))}
          <ButtonGroup variant="outlined" sx={{ mt: 2 }}>
            <Button onClick={onSave}>Save Palette</Button>
            <Button
              onClick={() => {
                onReset();
                setThemeState(defaultThemeState(theme));
              }}
            >
              Reset Palette
            </Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ flex: 1 }}>Preview area eventually</Box>
      </Box>
    </GlossaryMainWrapper>
  );
};

export default CustomizePalette;
