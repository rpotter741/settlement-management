import React, { useState } from 'react';
import Button from '../shared/Button/Button';
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

  return (
    <div className="flex flex-col h-screen justify-top items-center">
      <div className="sticky top-0 bg-background z-10 pb-4 w-full border-b-2 border-accent">
        <h1 className="text-3xl font-bold mb-4 text-center mt-4 ">
          Eclorean Ledger Creation Tool
        </h1>
        <div className="grid grid-cols-9 gap-4 justify-around px-4">
          <Button onClick={() => setTab('category')}>Category</Button>
          <Button onClick={() => setTab('event')}>Event</Button>
          <Button onClick={() => setTab('weather')}>Weather</Button>
          <Button onClick={() => setTab('status')}>Status</Button>
          <Button onClick={() => setTab('building')}>Building</Button>
          <Button onClick={() => setTab('upgrade')}>Upgrade</Button>
          <Button onClick={() => setTab('tradeHub')}>Trade Hub</Button>
          <Button onClick={() => setTab('settlementType')}>
            Settlement Type
          </Button>
          <Button onClick={() => setTab('settlement')}>Settlement</Button>
        </div>
      </div>
      {tab === 'category' && (
        <CreateCategory category={category} setCategory={setCategory} />
      )}
      {tab === 'event' && <CustomEvent event={event} setEvent={setEvent} />}
      {tab === 'weather' && (
        <div>Weather!</div>
        // <CreateCategory category={weather} setCategory={setWeather} />
      )}
      {tab === 'status' && (
        <div>Statuses!</div>
        // <CreateCategory category={status} setCategory={setStatus} />
      )}
      {tab === 'building' && (
        <div>Buildings!</div>
        // <CreateCategory category={building} setCategory={setBuilding} />
      )}
      {tab === 'upgrade' && (
        <div>Upgrades!</div>
        // <CreateCategory category={upgrade} setCategory={setUpgrade} />
      )}
      {tab === 'tradeHub' && (
        <div>Trade Hubs!</div>
        // <CreateCategory category={tradeHub} setCategory={setTradeHub} />
      )}
      {tab === 'settlementType' && (
        <div>Settlement Types!</div>
        // <CreateCategory category={settlementType} setCategory={setSettlementType} />
      )}
      {tab === 'settlement' && (
        <div>Settlements!</div>
        // <CreateCategory category={settlement} setCategory={setSettlement} />
      )}
    </div>
  );
};

export default CustomCreation;
