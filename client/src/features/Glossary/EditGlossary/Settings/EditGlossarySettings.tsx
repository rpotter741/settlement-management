import { Tab } from '@/app/types/TabTypes.js';
import {
  Box,
  Button,
  Checkbox,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import ContinentPropertyLabels from '../../utils/propertyMaps/ContinentPropertyLabels.js';
import { useSelector } from 'react-redux';
import { selectEditGlossaryById } from '@/app/selectors/glossarySelectors.js';
import EcloreanGrid, {
  Row,
} from '@/components/shared/EcloreanGrid/EcloreanGrid.js';
import useGlossaryEditor from '@/hooks/glossary/useGlossaryEditor.js';
import getPropertyLabel, {
  genrePropertyLabelDefaults,
  SubModelTypes,
} from '../../utils/getPropertyLabel.js';
import {
  GenericObject,
  Glossary,
} from '../../../../../../shared/types/index.js';
import { GlossaryStateEntry } from '@/app/types/GlossaryTypes.js';
import { useMemo, useState } from 'react';
import { capitalize } from 'lodash';
import MotionBox from '@/components/shared/Layout/Motion/MotionBox.js';
import { termRenderOrder } from '../Terms/GlossaryTermsTab.js';
import { TitledCollapse } from '@/components/index.js';
import test from 'node:test';

interface EditGlossarySettingsProps {}

const RenderLabel = ({
  label,
  variant = 'body2',
  align = 'center',
  secondaryLabel,
}: {
  label: string;
  variant: 'h1' | 'h2' | 'h6' | 'body1' | 'body2' | 'caption';
  align?: 'left' | 'center' | 'right';
  secondaryLabel?: string;
}) => {
  return (
    <>
      <Typography variant={variant} sx={{ textAlign: align }}>
        {label}
      </Typography>
      {secondaryLabel && (
        <Typography variant="caption">{secondaryLabel}</Typography>
      )}
    </>
  );
};

const ExpandedComponent = ({ label }: { label: string }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="body1">
        Expanded content for {label}. Here you can add more detailed settings
        and options related to this row.
      </Typography>
    </Box>
  );
};

const RenderTieredHeader = ({
  main,
  sub,
  width,
}: {
  main: string;
  sub: string[];
  width?: string;
}) => {
  const calculatedWidth = width ?? `${100 / sub.length}%`;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6">{main}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {sub.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ width: `${calculatedWidth}` }}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const RenderXCheckbox = ({
  checked,
  onClick,
  width = '80px',
}: {
  checked: boolean[];
  onClick: (index: number) => void;
  width?: string;
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {checked.map((_, index) => (
        <Box
          key={index}
          sx={{
            width,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Checkbox checked={checked[index]} onChange={() => onClick(index)} />
        </Box>
      ))}
    </Box>
  );
};

const RenderChecksFromObject = ({
  source,
  onClick,
  width = '80px',
}: {
  source: GenericObject;
  onClick: (key: string) => void;
  width?: string;
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {Object.entries(source).map(([key, value]) => (
        <Box
          key={key}
          sx={{
            width,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Checkbox checked={!!value} onChange={() => onClick(key)} />
        </Box>
      ))}
    </Box>
  );
};

const RenderButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Button variant="outlined" onClick={onClick}>
        {label}
      </Button>
    </Box>
  );
};

export const columns = [
  {
    component: RenderLabel,
    props: { label: 'Name', variant: 'h6' },
    flex: 1,
    width: '150px',
  },
  {
    component: RenderLabel,
    props: { label: 'Enabled', variant: 'h6' },
    flex: 1,
    width: '100px',
  },
  {
    component: RenderTieredHeader,
    props: {
      main: 'Visibility',
      sub: ['Owner', 'Player', 'Resident', 'Public'],
      width: '80px',
    },
    flex: 1,
    width: 'auto',
  },
  {
    component: RenderLabel,
    props: { label: 'Actions', variant: 'h6' },
    flex: 1,
    width: '100px',
  },
];

const rows = [
  {
    id: '1',
    cells: [
      {
        component: RenderLabel,
        props: { label: 'Test Label 1', secondaryLabel: 'Some Backup String' },
      },
      {
        component: RenderXCheckbox,
        props: {
          length: 1,
          checked: [true],
          onClick: (index: number) => console.log(index),
          width: '75px',
        },
      },
      {
        component: RenderXCheckbox,
        props: {
          length: 4,
          checked: [true, false, false, false],
          onClick: (index: string) => console.log(index),
          width: '80px',
        },
      },
      {
        component: RenderButton,
        props: { label: 'Edit', onClick: () => console.log('Edit clicked') },
      },
    ],
    expandedComponent: ExpandedComponent,
    expandedProps: { label: 'Sugar Bug Bitches' },
  },
  {
    id: '2',
    cells: [
      {
        component: RenderLabel,
        props: { label: 'Test Label 2' },
      },
      {
        component: RenderXCheckbox,
        props: {
          length: 1,
          checked: [true],
          onClick: (index: number) => console.log(index),
          width: '75px',
        },
      },
      {
        component: RenderXCheckbox,
        props: {
          length: 4,
          checked: [true, false, false, false],
          onClick: (index: string) => console.log(index),
          width: '80px',
        },
      },
      {
        component: RenderButton,
        props: { label: 'Edit', onClick: () => console.log('Edit clicked') },
      },
    ],
  },
];

function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

interface SettingsRow {
  id: string;
  cells: {
    component: any;
    props: any;
  }[];
}

export type VisibilitySetting = 'private' | 'standard' | 'open' | 'public';

const defaultVisibilitySettings: Record<
  VisibilitySetting,
  Record<string, boolean>
> = {
  private: {
    collaborator: true,
    player: false,
    resident: false,
    public: false,
  },
  standard: {
    collaborator: true,
    player: true,
    resident: false,
    public: false,
  },
  open: {
    collaborator: true,
    player: true,
    resident: true,
    public: false,
  },
  public: {
    collaborator: true,
    player: true,
    resident: true,
    public: true,
  },
};

export function makeGlossarySettingsRow({
  termKey,
  subModel,
  glossary,
  toggleEnabled,
  toggleVisibilityByKeypath,
}: {
  termKey: string;
  subModel: SubModelTypes;
  glossary: GlossaryStateEntry;
  toggleEnabled: ({
    subModel,
    termKey,
  }: {
    subModel: SubModelTypes;
    termKey: string;
  }) => void;
  toggleVisibilityByKeypath: ({
    subModel,
    termKey,
    keypath,
  }: {
    subModel: SubModelTypes;
    termKey: string;
    keypath: string;
  }) => void;
}): SettingsRow {
  const { label, defaultLabel } = getPropertyLabel({
    key: termKey,
    subModel,
    glossary,
  });
  const secondaryLabel =
    defaultLabel !== label ? toTitleCase(defaultLabel) : null;
  const settings = glossary.integrationState?.[subModel]?.[termKey] || {};

  const enabled = settings?.enabled ?? true;
  const visibility = {
    collaborator:
      settings.visibility?.collaborator ??
      defaultVisibilitySettings[glossary.visibility]?.collaborator ??
      true,
    player:
      settings.visibility?.player ??
      defaultVisibilitySettings[glossary.visibility]?.player ??
      true,
    resident:
      settings.visibility?.resident ??
      defaultVisibilitySettings[glossary.visibility]?.resident ??
      false,
    public:
      settings.visibility?.public ??
      defaultVisibilitySettings[glossary.visibility]?.public ??
      false,
  };

  const calculatedSettings = {
    id: termKey,
    ...settings,
    enabled,
    visibility: {
      ...visibility,
    },
  };

  return calculatedSettings;
}

const EditGlossarySettings: React.FC<EditGlossarySettingsProps> = () => {
  //

  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  const { glossary, updateGlossary } = useGlossaryEditor();
  const toggleEnabled = (subModel: SubModelTypes, termKey: string) => {
    const currentValue =
      glossary.integrationState?.[subModel]?.[termKey]?.enabled ?? true;

    updateGlossary(
      `integrationState.${subModel}.${termKey}.enabled`,
      !currentValue
    );
  };
  const toggleVisibilityByKeypath = ({
    subModel,
    termKey,
    keypath,
  }: {
    subModel: SubModelTypes;
    termKey: string;
    keypath: string;
  }) => {
    const fallback =
      keypath === 'collaborator' || keypath === 'player' ? true : false;
    const currentState =
      glossary.integrationState?.[subModel]?.[termKey]?.visibility?.[keypath] ??
      fallback;

    updateGlossary(
      `integrationState.${subModel}.${termKey}.visibility.${keypath}`,
      !currentState
    );
  };

  if (!glossary) return null;

  return (
    <MotionBox
      layoutId="glossary-main"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      layout
    >
      {termRenderOrder.map((term, index) => (
        <TitledCollapse
          key={term}
          open={activeIndex === index}
          title={toTitleCase(term)}
          toggleOpen={() =>
            setActiveIndex(activeIndex === index ? null : index)
          }
        >
          fuck this
        </TitledCollapse>
      ))}
    </MotionBox>
  );
};

export default EditGlossarySettings;
