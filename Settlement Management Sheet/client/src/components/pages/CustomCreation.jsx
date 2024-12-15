import React, { useState } from 'react';
import Button from '../shared/Button/Button';
import CreateCategory from '../Categories/Create/CreateCategory';
import { emptyCategory } from '../../helpers/categories/emptyCategoryObjects';

const CustomCreation = () => {
  const [category, setCategory] = useState(emptyCategory);
  const [event, setEvent] = useState('');
  const [weather, setWeather] = useState('');
  const [status, setStatus] = useState('');
  const [tab, setTab] = useState('category');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-center mt-4">
        Eclorean Ledger Creation Tool
      </h1>
      <div className="flex justify-around px-4">
        <Button onClick={() => setTab('category')}>Category</Button>
        <Button onClick={() => setTab('event')}>Event</Button>
        <Button onClick={() => setTab('weather')}>Weather</Button>
        <Button onClick={() => setTab('status')}>Status</Button>
      </div>
      {tab === 'category' && (
        <CreateCategory category={category} setCategory={setCategory} />
      )}
      {tab === 'event' && (
        <div>Events!</div>
        // <CreateCategory category={event} setCategory={setEvent} />
      )}
      {tab === 'weather' && (
        <div>Weather!</div>
        // <CreateCategory category={weather} setCategory={setWeather} />
      )}
      {tab === 'status' && (
        <div>Statuses!</div>
        // <CreateCategory category={status} setCategory={setStatus} />
      )}
    </div>
  );
};

export default CustomCreation;
