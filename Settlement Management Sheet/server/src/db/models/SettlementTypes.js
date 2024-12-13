import mongoose from 'mongoose';

const SettlementTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  upgrades: { type: Array, default: [] }, // Placeholder for the upgrade tree
  tradeModifiers: { type: Object, default: {} }, // Placeholder for trade-related details
  status: { type: String, enum: ['complete', 'pending'], default: 'pending' },
});

const SettlementType = mongoose.model('SettlementType', SettlementTypeSchema);

export { SettlementType, SettlementTypeSchema };
