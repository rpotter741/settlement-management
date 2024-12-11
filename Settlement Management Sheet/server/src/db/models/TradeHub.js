import mongoose from 'mongoose';
import { TradeGoodSchema } from './TradeGood';

const TradeHubSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the trade settlement
  region: { type: String, default: '' }, // Optional: Tie hubs to regions
  tradeGoods: { type: [TradeGoodSchema], default: [] }, // Goods available for trade
  modifiers: {
    demandMultiplier: { type: Number, default: 1 }, // Affects price for all goods
    supplyVariance: { type: Number, default: 0 }, // Random fluctuation in availability
  },
  lastUpdated: { type: Date, default: Date.now }, // Timestamp for dynamic updates
});

const TradeHub = mongoose.model('TradeHub', TradeHubSchema);

export { TradeHubSchema, TradeHub };
