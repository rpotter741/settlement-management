const TradeNetworkSchema = new mongoose.Schema({
  settlementA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Settlement',
    required: true,
  },
  settlementB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Settlement',
    required: true,
  },
  tradeRules: {
    maxTransferPerTurn: { type: Number, default: 100 },
    allowedGoods: { type: [String], default: [] }, // Optional: Restrict tradeable goods
  },
});
