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
import TerrainIcon from '@mui/icons-material/Terrain';
import { Book, MenuBook } from '@mui/icons-material';
import { cancelToolEdit } from '@/app/thunks/toolThunks.js';

import { checklistContent as attrValidationFields } from '../features/Attributes/helpers/attributeChecklist.js';

export const tabMap = {
  apt: {
    component: null,
    icon: ProgressIcon,
    headerName: 'APT',
    validationFields: [],
  },
  action: {
    component: null,
    icon: ActionIcon,
    headerName: 'Action',
    validationFields: [],
  },
  attribute: {
    component: lazy(
      () =>
        import('../features/Attributes/components/wrappers/CreateAttribute.js')
    ),
    icon: ExtensionIcon,
    headerName: 'Attribute',
    validationFields: [
      'name',
      'description',
      'balance',
      'settlementPointCost',
      'thresholds',
    ],
  },
  building: {
    component: null,
    icon: BuildingIcon,
    headerName: 'Building',
    validationFields: [],
  },
  category: {
    component: lazy(
      () =>
        import('../features/Categories/components/wrappers/CreateCategory.js')
    ),
    icon: CategoryIcon,
    headerName: 'Category',
    validationFields: ['name', 'description'],
  },
  event: {
    component: lazy(
      () => import('../features/Events/components/wrappers/CreateEvent.js')
    ),
    icon: EventNoteIcon,
    headerName: 'Event',
    validationFields: ['name', 'description', 'date'],
  },
  kit: {
    component: null,
    icon: KitIcon,
    headerName: 'Kit',
    validationFields: ['name', 'description', 'icon'],
  },
  listener: {
    component: null,
    icon: HearingIcon,
    headerName: 'Listener',
    validationFields: ['name', 'description'],
  },
  settlementType: {
    component: null,
    icon: TypeIcon,
    headerName: 'Settlement Type',
    validationFields: ['name', 'description'],
  },
  settlement: {
    component: null,
    icon: CityIcon,
    headerName: 'Settlement',
    validationFields: ['name', 'description', 'icon'],
  },
  gameStatus: {
    component: lazy(
      () => import('../features/Statuses/components/wrappers/CreateStatus.js')
    ),
    icon: CoronavirusIcon,
    headerName: 'Status',
    validationFields: ['name', 'description'],
  },
  storyThread: {
    component: null,
    icon: NeedleIcon,
    headerName: 'Story Thread',
    validationFields: ['name', 'description'],
  },
  tradeHub: {
    component: null,
    icon: ScalesIcon,
    headerName: 'Trade Hub',
    validationFields: ['name', 'description', 'icon'],
  },
  upgrade: {
    component: null,
    icon: UpgradeIcon,
    headerName: 'Upgrade',
    validationFields: ['name', 'description', 'icon'],
  },
  geography: {
    component: lazy(
      () => import('../features/Glossary/forms/GeographyForm.js')
    ),
    icon: TerrainIcon,
    headerName: 'Geography',
    validationFields: [],
  },
  editGlossary: {
    component: lazy(() => import('../features/Glossary/EditGlossary.js')),
    icon: MenuBook,
    headerName: 'Glossary Settings',
    validationFields: [],
  },
};
