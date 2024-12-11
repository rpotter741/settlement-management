import mongoose from 'mongoose';

// Import related schemas
import EventLogSchema from './EventLog';
import { CategorySchema } from './Category'; // Custom category schema
import { BuildingSchema } from './Building'; // Building and branch schema
import { HealthSchema } from './Health'; // Health schema
import { VaultSchema } from './Vault'; // Vault schema
import { TradeGoodSchema } from './TradeGood'; // Trade good schema

const NotablePersonSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name is required
  age: { type: Number, default: null }, // Optional age
  race: { type: String, default: null }, // Optional race/species
  gender: { type: String, default: null }, // Optional gender
  profession: { type: String, default: null }, // Optional profession/title
  distinguishingFeatures: {
    eyes: { type: String, default: null },
    hair: { type: String, default: null },
    scars: { type: String, default: null },
    tattoos: { type: String, default: null },
    other: { type: String, default: null }, // For anything else!
  },
  encounters: [
    {
      gameDay: { type: Number, required: true }, // Tracks the day number of the encounter
      inGameDate: { type: String, default: '' }, // Optional immersion-friendly date (e.g., "14th of Sunreach, 2024")
      details: { type: String, default: '' }, // Description of the encounter
    },
  ],
  notes: { type: String, default: '' }, // General freeform notes about the person
});

const NarrativeStatsSchema = new mongoose.Schema({
  leader: { type: String, default: 'Unknown' },
  notableResidents: { type: [NotablePersonSchema], default: [] },
  foundingDate: { type: Date, default: null },
  populationSize: { type: String, default: 'Unknown' },
  customNotes: { type: String, default: '' },
});

const SettlementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, allowNull: true }, // Settlement type (e.g., city, village)
  region: { type: String, default: '' }, // Region or location
  level: { type: Number, default: 1 }, // Current level of the settlement
  categories: [CategorySchema], // Embedded array of categories
  eventsLog: EventLogSchema,
  tradeGoods: [TradeGoodSchema], // Embedded array of trade goods
  settlementPoints: { type: Number, default: 0 }, // Points for resource abstraction
  spCosts: { type: Map, of: Number }, // Settlement point costs per resource
  infrastructure: {
    type: [BuildingSchema], // Embedded array of buildings
  },
  taxRate: {
    type: String,
    enum: ['None', 'Low', 'Medium', 'High', 'Extreme'],
    default: 'Medium',
  }, // Tax rate
  taxImpacts: { type: Map, of: Number }, // Dynamic tax modifiers
  upgrades: { type: [String] }, // Array of completed upgrade IDs
  statuses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Status' }], // Embedded array of statuses
  notes: {
    private: { type: Map, of: String }, // Private player notes (keyed by player ID)
    shared: { type: [String] }, // Shared notes
  },
  logs: [
    {
      week: Number, // Turn number
      logEntries: [{ type: String }], // Array of log entries for the turn
    },
  ],
  vault: VaultSchema, // Embedded vault schema
  health: HealthSchema, // Embedded health schema
  narrativeStats: NarrativeStatsSchema, // Embedded narrative stats
  official: { type: Boolean, default: false }, // Official settlement flag
  metaData: {
    public: { type: Boolean, default: true }, // Public visibility flag
    createdBy: { type: String, required: true }, // Pulled from the user's authentication token
    createdAt: { type: Date, default: Date.now }, // Automatically set at creation
    lastModifiedBy: { type: String }, // Optional, updated on modification
    lastModifiedAt: { type: Date }, // Optional, updated on modification
    ratings: {
      total: { type: Number, default: 0 }, // cumulative rating
      count: { type: Number, default: 0 }, // Number of ratings
      users: {
        userId: {
          type: mongoose.Schema.types.ObjectId,
          ref: 'User',
          required: true,
        }, // User ID
        score: { type: Number, required: true }, // their rating
      },
    },
  },
});

const Settlement = mongoose.model('Settlement', SettlementSchema);
export default Settlement;
