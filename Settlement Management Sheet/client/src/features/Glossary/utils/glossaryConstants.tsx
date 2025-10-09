import {
  Public as PublicIcon,
  AccountBalance as AccountBalanceIcon,
  WbShade as WbShadeIcon,
  Flag as FlagIcon,
  Map as MapIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Groups as GroupsIcon,
  Description as DescriptionIcon,
  CalendarMonth as CalendarMonthIcon,
  Terrain as TerrainIcon,
} from '@mui/icons-material';

const entryTypeColors: Record<string, string> = {
  continent: 'info.main',
  domain: 'primary.main',
  territory: 'secondary.main',
  settlement: 'warning.main',
  province: 'warning.dark',
  location: 'honey.main',
  person: 'success.main',
  faction: 'error.main',
  note: 'text.primary',
  event: 'text.secondary',
  landmark: 'success.dark',
};

export const entryTypeIcons: Record<string, React.ReactNode> = {
  continent: <PublicIcon sx={{ color: entryTypeColors.continent }} />,
  domain: <AccountBalanceIcon sx={{ color: entryTypeColors.domain }} />,
  settlement: <WbShadeIcon sx={{ color: entryTypeColors.settlement }} />,
  territory: <MapIcon sx={{ color: entryTypeColors.territory }} />,
  province: <FlagIcon sx={{ color: entryTypeColors.province }} />,
  location: <RoomIcon sx={{ color: entryTypeColors.location }} />,
  person: <PersonIcon sx={{ color: entryTypeColors.person }} />,
  faction: <GroupsIcon sx={{ color: entryTypeColors.faction }} />,
  note: <DescriptionIcon sx={{ color: entryTypeColors.note }} />,
  event: <CalendarMonthIcon sx={{ color: entryTypeColors.event }} />,
  landmark: <TerrainIcon sx={{ color: entryTypeColors.landmark }} />,
};

export type GlossaryEntryTypeString =
  | 'continent'
  | 'domain'
  | 'territory'
  | 'settlement'
  | 'province'
  | 'location'
  | 'person'
  | 'faction'
  | 'note'
  | 'event'
  | 'landmark';

export const entryTypes = ['location', 'person', 'note', 'event'];

export const folderTypes = [
  'continent',
  'territory',
  'domain',
  'province',
  'landmark',
  'settlement',
  'faction',
];

export const entryTypeRenderOrder = [
  'continent',
  'territory',
  'domain',
  'province',
  'landmark',
  'settlement',
  'faction',
  'location',
  'person',
  'note',
  'event',
];
