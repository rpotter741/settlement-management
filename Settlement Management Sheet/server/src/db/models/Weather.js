import mongoose from 'mongoose';

const EffectSchema = new mongoose.Schema({
  target: { type: String, required: true }, // Target of the effect (e.g., 'health', 'food')
  attribute: { type: String, required: true }, // Attribute to modify (e.g., 'current', 'max')
  value: { type: Number, required: true }, // Base value of the effect
  type: { type: String, enum: ['attrition', 'retention'], required: true }, // Type of effect
});

const WeatherSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Weather type (e.g., 'Drought', 'Flood')
  effects: { type: [EffectSchema], required: true }, // List of effects
  customIntegrations: { type: [Object], default: [] }, // Additional custom effects
  step: { type: Number, required: true, default: 0 }, // Current severity step
  maxStep: { type: Number, required: true, default: 5 }, // Maximum severity step
});

// Create the model
const Weather = mongoose.model('Weather', WeatherSchema);

export default Weather;
