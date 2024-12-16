import mongoose from 'mongoose';

const ThresholdSchema = new mongoose.Schema({
  category: { type: String, required: true }, // Category to match
  attribute: { type: String, required: true }, // Attribute to compare
  operator: {
    type: String,
    enum: ['lt', 'lte', 'gt', 'gte', 'eq'],
    required: true,
  }, // Comparison operator
  value: { type: Number, required: true }, // Threshold value
});

const ConditionSchema = new mongoose.Schema({
  thresholds: [ThresholdSchema], // Array of threshold objects
  chance: { type: Number, default: 0 }, // Chance of the event occurring
});

const ImpactSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['category', 'settlement', 'status'], // Extendable if needed
    required: true,
  },
  category: { type: String, default: null }, // E.g., 'Survival' or 'Fear'
  attribute: { type: String, default: null }, // E.g., 'food' or 'medicalCapacity'
  key: { type: String, enum: [null, 'current', 'bonus'], default: null }, // Attribute key
  baseAmount: { type: Number, required: true }, // Base value of the impact
  immutable: { type: Boolean, default: false }, // Scaling flag
  conditions: [ConditionSchema], // Array of condition objects
});

export const PhaseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Phase name
  type: {
    type: String,
    enum: ['Immediate', 'Active', 'Passive', 'Indefinite'],
    required: true,
  }, // Phase type
  details: { type: String, default: '' }, // Description of the phase
  startDate: { type: Date, default: null }, // When the phase begins
  timeInDays: { type: Number, default: null }, // Duration of the phase
  laborNeeded: { type: Number, default: null }, // Labor required
  laborProgress: { type: Number, default: 0 }, // Progress towards completion
  completed: { type: Boolean, default: false }, // Whether the phase is complete
  impacts: {
    costs: [ImpactSchema], // Costs incurred during the phase
    rewards: [ImpactSchema], // Rewards granted upon completion
  }, // Rewards granted upon completion
});

const GuardImpactSchema = new mongoose.Schema({
  location: { type: String, required: true }, // Location of the impact
  category: { type: String, required: true }, // Category impacted (e.g., Trade)
  value: { type: Number, required: true }, // Percentage reduction to event damages
  prevent: { type: Number, required: true }, // Minimum garrison to prevent the event
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Event name
  scheduled: { type: Boolean, default: false }, // If the event is scheduled
  recurring: { type: Boolean, default: false }, // If the event restarts after completion
  startDate: { type: Date, default: null }, // Start date for the event
  phases: [PhaseSchema], // Array of phase objects
  phaseComplete: { type: Boolean, default: false }, // If the current phase is complete
  autocomplete: { type: Boolean, default: false }, // Automatically progress phases
  guardImpact: { type: GuardImpactSchema, default: null }, // Guard impact details
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Extreme'],
    default: 'Moderate',
  }, // Event severity
  timeInDays: { type: Number, default: null }, // Duration (null for indefinite)
  categories: [{ type: String, required: true }], // Categories tied to the event
  details: { type: String, default: '' }, // Optional event description
  workers: { type: Number, default: 0 }, // Workers assigned to the event
  hide: { type: Boolean, default: false }, // Display status
  link: {
    type: {
      type: String,
      enum: ['DM', 'player', 'auto'], // Determines how the link is resolved
      required: true,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId, // References linked events
        ref: 'Event',
      },
    ],
    randomWeights: [Number], // Optional: Weights for 'auto' random selection
  },
  tags: { type: [String], default: [] }, // Optional tags for filtering
  votes: {
    options: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        type: { type: String, enum: ['Event', 'Resource'], required: true },
        impact: { type: mongoose.Schema.Types.Mixed, default: null }, // Can reference a related event or resource adjustment
        votes: { type: Number, default: 0 },
      },
    ],
    voterIds: { type: [String], default: [] },
  },
  flavorText: {
    Low: { type: String, default: '' },
    Moderate: { type: String, default: '' },
    High: { type: String, default: '' },
    Extreme: { type: String, default: '' },
  },
});

const Event = mongoose.model('Event', EventSchema);

export { Event, EventSchema, PhaseSchema, ImpactSchema };
