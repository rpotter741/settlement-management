import mongoose from 'mongoose';

export const PhaseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Phase name
  details: { type: String, default: '' }, // Description of the phase
  startDate: { type: Date, default: null }, // When the phase begins
  timeInDays: { type: Number, default: null }, // Duration of the phase
  laborNeeded: { type: Number, default: null }, // Labor required
  laborProgress: { type: Number, default: 0 }, // Progress towards completion
  completed: { type: Boolean, default: false }, // Whether the phase is complete
  cost: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ], // Resources required for the phase
  reward: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ], // Rewards granted upon completion
});

const GuardImpactSchema = new mongoose.Schema({
  location: { type: String, required: true }, // Location of the impact
  category: { type: String, required: true }, // Category impacted (e.g., Trade)
  value: { type: Number, required: true }, // Percentage reduction to event damages
  prevent: { type: Number, required: true }, // Minimum garrison to prevent the event
});

const EventSchema = new mongoose.Schema({
  id: { type: String, default: () => `event-${Date.now()}` }, // Unique ID
  name: { type: String, required: true }, // Event name
  scheduled: { type: Boolean, default: false }, // If the event is scheduled
  recurring: { type: Boolean, default: false }, // If the event restarts after completion
  type: {
    type: String,
    enum: ['Immediate', 'Active', 'Passive', 'Indefinite'],
    required: true,
  }, // Event type
  timeInDays: { type: Number, default: null }, // Duration (null for indefinite)
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
  category: { type: String, required: true }, // Category tied to the event
  details: { type: String, default: '' }, // Optional event description
  workers: { type: Number, default: 0 }, // Workers assigned to the event
  hide: { type: Boolean, default: false }, // Display status
  link: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null }, // Linked event
  tags: { type: [String], default: [] }, // Optional tags for filtering
});

const Event = mongoose.model('Event', EventSchema);

export { Event, EventSchema };
