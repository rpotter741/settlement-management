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
  const createToolTabs = [
    {
      name: 'Attribute',
      component: CreateAttribute,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Category',
      component: CreateCategory,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Event',
      component: CreateCategory,
      contentSx: { ...contentSx, flexGrow: 4 },
    },
    {
      name: 'Listeners',
      component: CustomListeners,
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
    },
    {
      name: 'Upgrade',
      component: CreateUpgrade,
    },
    {
      name: 'Trade Hub',
      component: CreateTradeHub,
    },
    {
      name: 'Settlement Type',
      component: CreateSettlementType,
    },
    {
      name: 'Settlement',
      component: CreateSettlement,
    },
    {
      name: 'Story Thread',
      component: CreateCategory,
    },
    {
      name: 'APT',
      component: CreateAPT,
    },
  ];

  return (
    <>
      <TabbedContainer tabs={createToolTabs} />
    </>
  );
};

export default CustomCreation;
