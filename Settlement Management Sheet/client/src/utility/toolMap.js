import { lazy } from 'react';

import EventNoteIcon from '@mui/icons-material/EventNote';
import HearingIcon from '@mui/icons-material/Hearing';
import ExtensionIcon from '@mui/icons-material/Extension';
import BuildingIcon from '@mui/icons-material/Apartment';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import TypeIcon from '@mui/icons-material/TypeSpecimen';
import ActionIcon from '@mui/icons-material/AutoAwesome';
import ProgressIcon from '@mui/icons-material/AutoGraph';
import NeedleIcon from '@mui/icons-material/Gesture';
import ScalesIcon from '@mui/icons-material/Balance';
import CityIcon from '@mui/icons-material/AccountTree';
import CategoryIcon from '@mui/icons-material/Category';
import KitIcon from '@mui/icons-material/HomeRepairService';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';

export const toolMap = {
  apt: {
    component: null,
    icon: ProgressIcon,
  },
  action: {
    component: null,
    icon: ActionIcon,
  },
  attribute: {
    component: lazy(
      () =>
        import('../features/Attributes/components/wrappers/CreateAttribute.jsx')
    ),
    icon: ExtensionIcon,
  },
  building: {
    component: null,
    icon: BuildingIcon,
  },
  category: {
    component: lazy(
      () =>
        import('../features/Categories/components/wrappers/CreateCategory.jsx')
    ),
    icon: CategoryIcon,
  },
  event: {
    component: lazy(
      () => import('../features/Events/components/wrappers/CreateEvent.jsx')
    ),
    icon: EventNoteIcon,
  },
  kit: {
    component: null,
    icon: KitIcon,
  },
  listener: {
    component: null,
    icon: HearingIcon,
  },
  settlementType: {
    component: null,
    icon: TypeIcon,
  },
  settlement: {
    component: null,
    icon: CityIcon,
  },
  gameStatus: {
    component: lazy(
      () => import('../features/Statuses/components/wrappers/CreateStatus.jsx')
    ),
    icon: CoronavirusIcon,
  },
  storyThread: {
    component: null,
    icon: NeedleIcon,
  },
  tradeHub: {
    component: null,
    icon: ScalesIcon,
  },
  upgrade: {
    component: null,
    icon: UpgradeIcon,
  },
};
