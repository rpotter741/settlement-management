import mongoose from 'mongoose';

const { Schema } = mongoose;

// Subdocument for values in attributes
const ValuesSchema = new Schema({
  current: { type: Number, required: true },
  maxPerLevel: { type: Number, required: true },
  max: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
});

// Subdocument for attrition and retention ==> move to gameLogic(?) or maybe campaignSettings(?)
const RateSchema = new Schema({
  enabled: { type: Boolean, default: false },
  rate: { type: Number, default: null },
  perLevel: { type: Boolean, default: false },
  interval: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null,
  },
});

// Subdocument for settlement point costs
const SettlementPointCostSchema = new Schema({
  default: { type: Number, required: true },
  unique: [
    {
      name: { type: String, required: true },
      cost: { type: Number, required: true },
    },
  ],
});

// Subdocument for attributes
const AttributeSchema = new Schema({
  name: { type: String, required: true },
  values: { type: ValuesSchema, required: true },
  costPerLevel: { type: Number, required: true },
  settlementPointCost: { type: SettlementPointCostSchema, required: true },
});

// Subdocument for thresholds
const ThresholdSchema = new Schema({
  max: { type: Number, required: true },
  rating: { type: String, required: true },
});

// Subdocument for conditions in dependencies
const ConditionSchema = new Schema({
  rating: { type: String, required: true },
  modifier: { type: Number, required: true },
});

// Subdocument for dependencies
const DependencySchema = new Schema({
  target: { type: String, required: true },
  conditions: { type: [ConditionSchema], required: true },
});

// Main schema for CustomCategory
const CustomCategorySchema = new Schema({
  name: { type: String, required: true },
  attributes: { type: Map, of: AttributeSchema }, // Map for dynamic attribute keys
  thresholds: { type: [ThresholdSchema], required: true },
  rating: { type: String, default: undefined },
  dependencies: { type: [DependencySchema], default: [] },
  bonus: { type: Number, default: 0 },
  type: { type: String, enum: ['official', 'custom'], default: 'custom' },
});

const CustomCategory = mongoose.model('CustomCategory', CustomCategorySchema);

export { CustomCategory, CustomCategorySchema };
