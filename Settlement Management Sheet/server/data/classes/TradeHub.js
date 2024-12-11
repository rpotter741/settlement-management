export default class TradeHub {
  constructor({
    name,
    description = '',
    tradeGoods = [],
    modifiers = {},
    trendsEnabled = true,
    region = '',
  }) {
    this.name = name; // Name of the TradeHub
    this.description = description; // Optional description for narrative purposes
    this.tradeGoods = tradeGoods; // Array of TradeGood objects
    this.modifiers = modifiers; // Global modifiers affecting all trade goods
    this.trendsEnabled = trendsEnabled; // Toggle for trend automation
    this.region = region; // Regional grouping for campaigns
    this.lastUpdated = Date.now(); // Timestamp of the last trend adjustment
  }

  // Add a new trade good
  addTradeGood(tradeGood) {
    this.tradeGoods.push(tradeGood);
  }

  // Remove a trade good by name
  removeTradeGood(name) {
    this.tradeGoods = this.tradeGoods.filter((good) => good.name !== name);
  }

  // Adjust availability of all trade goods
  adjustAvailability() {
    if (!this.trendsEnabled) return; // Skip if trends are disabled

    this.tradeGoods.forEach((good) => {
      switch (good.trend) {
        case 'static':
          good.available = this.handleStatic(good);
          break;
        case 'increasing':
        case 'decreasing':
          good.available = this.handleLinearTrend(good);
          break;
        case 'cyclical':
          good.available = this.handleCyclicalTrend(good);
          break;
        default:
          console.warn(`Unknown trend type: ${good.trend}`);
          break;
      }
    });

    this.lastUpdated = Date.now();
  }

  // Static trend handler
  handleStatic(good) {
    return good.available; // No change
  }

  // Linear trend handler
  handleLinearTrend(good) {
    return Math.max(0, good.available + good.trendMagnitude);
  }

  // Cyclical trend handler
  handleCyclicalTrend(good) {
    const cycleValue =
      Math.sin((2 * Math.PI * good.cyclePosition) / good.cycleLength) *
      good.trendMagnitude;
    good.cyclePosition = (good.cyclePosition + 1) % good.cycleLength; // Advance cycle
    return Math.max(0, good.available + cycleValue);
  }

  // Update a trade good's properties
  updateTradeGood(name, updates) {
    const tradeGood = this.tradeGoods.find((good) => good.name === name);
    if (tradeGood) {
      Object.assign(tradeGood, updates);
    } else {
      console.warn(`Trade good "${name}" not found.`);
    }
  }

  // Apply global modifiers
  applyModifiers() {
    this.tradeGoods.forEach((good) => {
      const { priceMultiplier = 1, demandMultiplier = 1 } = this.modifiers;
      good.currentPrice = Math.round(
        good.basePrice *
          good.priceMultiplier *
          priceMultiplier *
          demandMultiplier
      );
    });
  }
}
