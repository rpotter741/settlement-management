import mongoose from 'mongoose';
import Settlement from '../src/db/models/Settlement'; // Update with your actual file path
import EventLog from '../src/db/models/EventLog'; // Update with your actual file path
import Event from '../src/db/models/Event'; // Update with your actual file path

import Economy from '../data/economyObject';
import Survival from '../data/survivalObject';
import Safety from '../data/safetyObject';

import dotenv from 'dotenv';

dotenv.config();

// Connect to the database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected.');

    // Clear the database (optional)
    await Settlement.deleteMany({});
    await EventLog.deleteMany({});
    await Event.deleteMany({});

    console.log('Existing data cleared.');

    // Default categories
    const defaultCategories = [Survival, Safety, Economy];

    // Create event log
    const eventLog = new EventLog();

    const activeEvent = new Event({
      name: 'Bridge Repair',
      scheduled: false,
      recurring: false,
      startDate: '12th of Evenfall',
      phases: [
        {
          name: 'Bridge Collapse',
          type: 'Immediate',
          details: 'A bridge critical to trade has been swept away in a flood.',
          startDate: undefined,
          timeInDays: null,
          laborNeeded: null,
          laborProgress: null,
          completed: true,
          cost: [],
          reward: [
            { name: 'tradeCurrent', quantity: 3 },
            { name: 'tradeBonus', quantity: 1 },
          ],
        },
        {
          name: 'Repairing Bridge',
          type: 'Active',
          details:
            'Masonry and carpentry work is ongoing to repair the bridge.',
          startDate: undefined,
          timeInDays: 12,
          laborNeeded: 8,
          laborProgress: 0,
          completed: false,
          cost: [
            { name: 'supplies', quantity: 15 },
            { name: 'gold', quantity: 120 },
          ],
          reward: [
            { name: 'tradeBonus', quantity: 1 },
            { name: 'tradeCurrent', quantity: 3 },
          ],
        },
      ],
      timeInDays: undefined,
      autocomplete: false,
      guardImpact: null,
      severity: 'Moderate',
      category: 'Economy',
      details:
        'A bridge critical to trade has been swept away in a flood and needs to be dealt with.',
      hide: false,
      link: null,
      tags: ['bridge', 'repair', 'economy', 'trade'],
      votes: {},
    });

    eventLog.addEvent(activeEvent);

    // Create settlement
    const settlement = new Settlement({
      name: 'Cyfehil',
      type: null,
      level: 3,
      categories: defaultCategories,
      eventsLog: eventLog,
      taxRate: 'Medium',
      notes: {
        private: {},
        shared: [],
      },
    });

    await settlement.save();
    console.log('Settlement created.');

    await eventLog.save();
    console.log('Event log created.');

    mongoose.connection.close();
    console.log('Database seeding completed.');
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

// Run the seeding script
seedDatabase();
