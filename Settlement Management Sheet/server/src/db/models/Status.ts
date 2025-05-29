import mongoose from 'mongoose';

const EffectSchema = new mongoose.Schema({
  target: { type: String, required: true }, // The target of the effect (e.g., 'settlementPoints', 'taxRevenue')
  type: {
    type: String,
    enum: ['attrition', 'bonus', 'penalty'],
    required: true,
  }, // Type of effect
  value: { type: Number, required: true }, // Magnitude of the effect
});

const ConditionSchema = new mongoose.Schema({
  category: { type: String, required: true }, // The category the condition applies to (e.g., 'Survival', 'Economy')
  operator: {
    type: String,
    enum: ['lt', 'lte', 'gt', 'gte', 'eq'],
    required: true,
  }, // Comparison operator
  value: { type: Number, required: true }, // The threshold value for the condition
});

const StatusSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the status
  description: { type: String, default: '' }, // Optional description for context
  effects: { type: [EffectSchema], default: [] }, // Effects this status has on the settlement
  step: { type: Number, default: 0 }, // Current severity level
  maxStep: { type: Number, default: 5 }, // Maximum severity level
  tags: { type: [String], default: [] }, // Tags for categorization and dynamic triggers
  conditions: { type: [ConditionSchema], default: [] }, // Conditions required for the status
});

const Status = mongoose.model('Status', StatusSchema);

export { Status, StatusSchema };
