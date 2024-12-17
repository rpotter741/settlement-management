import React, { useState } from 'react';
import TabbedContainer from '../utils/TabbedContainerTwo';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CreateCategory from '../Categories/Create/CreateCategory';
import { emptyCategory } from '../../helpers/categories/emptyCategoryObjects';
import CustomEvent from '../Events/Create/CustomEventTwo';
import { emptyEvent } from '../../helpers/events/emptyEventObjects';

const CustomCreation = () => {
  const [category, setCategory] = useState({ ...emptyCategory });
  const [event, setEvent] = useState({ ...emptyEvent });
  const [weather, setWeather] = useState('');
  const [status, setStatus] = useState('');
  const [building, setBuilding] = useState('');
  const [upgrade, setUpgrade] = useState('');
  const [tradeHub, setTradeHub] = useState('');
  const [settlement, setSettlement] = useState('');
  const [settlementType, setSettlementType] = useState('');
  const [tab, setTab] = useState('category');

  const createToolTabs = [
    {
      name: 'Category',
      component: CreateCategory,
      props: { category, setCategory },
    },
    {
      name: 'Event',
      component: CustomEvent,
      props: { event, setEvent },
    },
    {
      name: 'Weather',
      component: <div></div>,
      props: { category, setCategory },
    },
    {
      name: 'Status',
      component: <div></div>,
      props: { category, setCategory },
    },
    {
      name: 'Building',
      component: <div></div>,
      props: { category, setCategory },
    },
    {
      name: 'Upgrade',
      component: <div></div>,
      props: { category, setCategory },
    },
    {
      name: 'Trade Hub',
      component: <div></div>,
      props: { category, setCategory },
    },
    {
      name: 'Settlement Type',
      component: <div></div>,
      props: { category, setCategory },
    },
    {
      name: 'Settlement',
      component: <div></div>,
      props: { category, setCategory },
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Eclorean Ledger Creation Tool
      </Typography>
      <TabbedContainer tabs={createToolTabs} removeLimit={Infinity} />
    </Box>
  );
};

export default CustomCreation;
