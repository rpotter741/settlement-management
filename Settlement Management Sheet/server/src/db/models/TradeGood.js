import mongoose from 'mongoose';

const TradeGoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  available: { type: Number, default: 0 }, // Quantity available for trade
  basePrice: { type: Number, required: true },
  priceMultiplier: { type: Number, default: 1 }, // Multiplier for dynamic pricing
  currentPrice: { type: Number, default: null }, // Calculated price
  trend: {
    type: String,
    enum: ['static', 'increasing', 'decreasing', 'cyclical'],
    default: 'static', // Default behavior is no change
  },
  trendMagnitude: { type: Number, default: 0 }, // Magnitude of change per turn
  cycleLength: { type: Number, default: 0 }, // For cyclical trends, how long the cycle is
  cyclePosition: { type: Number, default: 0 }, // Current position in the cycle
});

const TradeGood = mongoose.model('TradeGood', TradeGoodSchema);

export { TradeGoodSchema, TradeGood };
