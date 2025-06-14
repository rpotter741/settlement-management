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
  nation: 'primary.main',
  settlement: 'warning.main',
  region: 'secondary.main',
  location: 'honey.main',
  person: 'success.main',
  faction: 'error.main',
  note: 'text.primary',
  event: 'text.secondary',
  geography: 'success.dark',
};

export const entryTypeIcons: Record<string, React.ReactNode> = {
  continent: <PublicIcon sx={{ color: entryTypeColors.continents }} />,
  nation: <AccountBalanceIcon sx={{ color: entryTypeColors.nation }} />,
  settlement: <WbShadeIcon sx={{ color: entryTypeColors.settlement }} />,
  region: <FlagIcon sx={{ color: entryTypeColors.region }} />,
  location: <RoomIcon sx={{ color: entryTypeColors.location }} />,
  person: <PersonIcon sx={{ color: entryTypeColors.person }} />,
  faction: <GroupsIcon sx={{ color: entryTypeColors.faction }} />,
  note: <DescriptionIcon sx={{ color: entryTypeColors.note }} />,
  event: <CalendarMonthIcon sx={{ color: entryTypeColors.event }} />,
  geography: <TerrainIcon sx={{ color: entryTypeColors.geography }} />,
};

export const entryTypes = ['location', 'person', 'note', 'event'];

export const folderTypes = [
  'continent',
  'nation',
  'region',
  'geography',
  'settlement',
  'faction',
];
