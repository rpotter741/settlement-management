import mongoose from 'mongoose';

const AttritionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the attrition factor (e.g., "Food Spoilage")
  rate: { type: Number, required: true }, // Rate at which attrition occurs
  interval: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  }, // How often it occurs
});

const RetentionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the retention factor (e.g., "Resource Conservation")
  rate: { type: Number, required: true }, // Rate of retention improvement
  interval: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  }, // How often it applies
});

const ModifierSchema = new mongoose.Schema({
  target: { type: String, required: true }, // Target category or attribute (e.g., "Survival:food")
  effect: { type: Number, required: true }, // Value of the modifier
  type: {
    type: String,
    enum: ['attrition', 'bonus', 'penalty'],
    required: true,
  }, // Type of modification
});

const GameLogicSchema = new mongoose.Schema({
  attrition: { type: [AttritionSchema], default: [] }, // Global attrition factors
  retention: { type: [RetentionSchema], default: [] }, // Global retention factors
  modifiers: { type: [ModifierSchema], default: [] }, // Specific game logic modifiers
});

export const GameLogic = mongoose.model('GameLogic', GameLogicSchema);
export { GameLogicSchema };
