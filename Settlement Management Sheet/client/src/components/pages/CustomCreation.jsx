import React, { useState } from 'react';
import TabbedContainer from '../shared/TabbedContainer/TabbedContainer';

import Typography from '@mui/material/Typography';

import CreateAttribute from '../../features/Attributes/components/wrappers/CreateAttribute';

import {
  emptyCategory,
  emptyAttribute,
} from '../../helpers/categories/emptyCategoryObjects';

import CreateCategory from '../../features/Categories/components/wrappers/CreateCategory.jsx';

import CustomEvent from '../Events/Create/CustomEventTwo';
import { emptyEvent } from '../../helpers/events/emptyEventObjects';

import CustomListeners from '../Listeners/Create/CustomListeners';

import CreateWeather from '../Weather/Create/CreateWeather';
import { emptyWeather } from '../../helpers/weather/emptyWeatherObject.js';

import CreateStatus from '../Status/CreateStatus';

import CreateBuilding from '../Building/CreateBuilding';

import CreateUpgrade from '../Upgrade/CreateUpgrade';

import CreateTradeHub from '../TradeHub/Create/TradeHub';

import CreateSettlementType from '../SettlementType/CreateSettlementType';

import CreateSettlement from '../Settlement/CreateSettlement';

import CreateAPT from '../APT/CreateAPT';

import sidebarSx from '../shared/Sidebar/styles.js';
import contentSx from '../shared/TabbedContainer/contentStyles';

const CustomCreation = () => {
  const [attribute, setAttribute] = useState({ ...emptyAttribute });
  const [category, setCategory] = useState({ ...emptyCategory });
  const [event, setEvent] = useState({ ...emptyEvent });
  const [weather, setWeather] = useState({ ...emptyWeather });
  const [status, setStatus] = useState('');
  const [building, setBuilding] = useState('');
  const [upgrade, setUpgrade] = useState('');
  const [tradeHub, setTradeHub] = useState('');
  const [settlement, setSettlement] = useState('');
  const [settlementType, setSettlementType] = useState('');
  const [apt, setAPT] = useState('');
  const [tab, setTab] = useState('category');

  const createToolTabs = [
    {
      name: 'Attribute',
      component: CreateAttribute,
      sidebarSx,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Category',
      component: CreateCategory,
      sidebarSx,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Event',
      component: CreateCategory,
      sidebarSx,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Listeners',
      component: CustomListeners,
      props: { event, setEvent },
      sidebarSx,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Status',
      component: CreateCategory,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Building',
      component: CreateBuilding,
      props: { category, setCategory },
    },
    {
      name: 'Upgrade',
      component: CreateUpgrade,
      props: { category, setCategory },
    },
    {
      name: 'Trade Hub',
      component: CreateTradeHub,
      props: { category, setCategory },
    },
    {
      name: 'Settlement Type',
      component: CreateSettlementType,
      props: { category, setCategory },
    },
    {
      name: 'Settlement',
      component: CreateSettlement,
      props: { category, setCategory },
    },
    {
      name: 'Story Thread',
      component: CreateCategory,
      props: { category, setCategory },
    },
    {
      name: 'APT',
      component: CreateAPT,
      props: { category, setCategory },
    },
  ];

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Eclorean Ledger Creation Tool
      </Typography>
      <TabbedContainer tabs={createToolTabs} />
    </>
  );
};

export default CustomCreation;
