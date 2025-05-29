import mongoose from 'mongoose';

const EventsSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  minTurn: { type: Number, required: true },
});

const EffectSchema = new mongoose.Schema({
  scope: {
    type: String,
    enum: ['Category', 'Settlement', 'Building'],
    required: true,
  }, // Scope of the effect (e.g., 'settlement', 'player')
  target: { type: String, required: true }, // Target of the effect (e.g., 'health', 'food')
  attribute: { type: String, required: true },
  key: { type: String, default: null },
  value: { type: Number, required: true }, // Base value of the effect
  type: { type: String, enum: ['attrition', 'retention'], required: true }, // Type of effect
  events: { type: Map, of: [EventsSchema], required: true, default: {} },
});

const WeatherSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Weather type (e.g., 'Drought', 'Flood')
  method: { type: String, enum: ['Simple', 'Complex'], required: true }, // Weather method (e.g., 'Simple', 'Complex')
  effects: {
    type: Map,
    of: [EffectSchema], // Each step maps to an array of effects
    required: true,
  },
  step: { type: Number, required: true, default: 0 }, // Current severity step
  maxStep: { type: Number, required: true, default: 5 }, // Maximum severity step
});

// Create the model
const Weather = mongoose.model('Weather', WeatherSchema);

export default Weather;
