import mongoose from 'mongoose';

const LevelBonusSchema = new mongoose.Schema({
  level: { type: Number, required: true }, // The settlement level
  effects: {
    type: Map,
    of: Number, // Effects are key-value pairs where keys are effect types, and values are numeric adjustments
  },
});

const HealthSchema = new mongoose.Schema({
  current: { type: Number, default: 100, required: true }, // Current health
  maxHealthBase: { type: Number, default: 100, required: true }, // Base max health
  maxHealthBonus: { type: Number, default: 0, required: true }, // Bonus to max health
  levelBonuses: { type: [LevelBonusSchema], default: [] }, // Array of level-based bonuses
});

// Create the model
const Health = mongoose.model('Health', HealthSchema);

export { Health, HealthSchema };
