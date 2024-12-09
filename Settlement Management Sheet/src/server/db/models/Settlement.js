import mongoose from 'mongoose';

// Import related schemas
import EventLogSchema from './EventLog';
import { CategorySchema } from './Category'; // Custom category schema
import { BuildingSchema } from './Building'; // Building and branch schema
import { HealthSchema } from './Health'; // Health schema
import { VaultSchema } from './Vault'; // Vault schema

const SettlementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // Settlement type (e.g., city, village)
  level: { type: Number, default: 1 }, // Current level of the settlement
  categories: [CategorySchema], // Embedded array of categories
  eventsLog: EventLogSchema,
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
  official: { type: Boolean, default: false }, // Official settlement flag
  metaData: {
    public: { type: Boolean, default: true }, // Public visibility flag
    createdBy: { type: String, required: true }, // Pulled from the user's authentication token
    createdAt: { type: Date, default: Date.now }, // Automatically set at creation
    lastModifiedBy: { type: String }, // Optional, updated on modification
    lastModifiedAt: { type: Date }, // Optional, updated on modification
  },
});

const Settlement = mongoose.model('Settlement', SettlementSchema);
export default Settlement;
