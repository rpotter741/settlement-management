import EventLog from './eventLogClass';
import Vault from './vaultClass';
import Health from './healthClass';
import Infrastructure from './infrastructureClass';
class Settlement {
  constructor(
    name,
    type,
    level,
    categories,
    buildings,
    taxImpacts,
    upgrades,
    statuses
  ) {
    this.name = name; // Settlement name
    this.type = type; // Settlement type (e.g., city, village)
    this.level = level || 1; // Current level of the settlement
    this.categories = categories || []; // Tracks default and custom categories (e.g., Survival, Economy)
    this.eventsLog = new EventLog(); // Instance of the EventLog class
    this.settlementPoints = 0; // Settlement points (abstraction of settlement efforts, used to buy resources without gold)
    this.spCosts = {}; // Costs for spending settlement points
    this.infrastructure = new Infrastructure(buildings); // Tracks building status (from the Buildings class)
    this.taxRate = 'Medium'; // Current tax rate
    this.taxImpacts = taxImpacts || {}; // Dynamic modifiers for tax calculations
    this.upgrades = upgrades || []; // Array of completed upgrades
    this.statuses = statuses || []; // Array of active statuses
    this.tradeGoods = []; // Trade goods available in the settlement
    this.notes = {
      private: {}, // Private notes for players
      shared: [], // Shared notes
    };
    this.logs = []; // Weekly log entries
    this.vault = new Vault(0); // Settlement's gold/resource tracker
    this.health = new Health(); // Tracks settlement health
  }

  initialize() {
    // initialization logic here
  }

  getSPCosts() {
    const costs = {};
    this.categories.forEach((category) => {
      Object.entries(category.attributes).forEach(([key, attr]) => {
        costs[key] = attr.settlementPointCost;
      });
    });
    return costs;
  }

  adjustPrices(tradeGoods, factors) {
    tradeGoods.forEach((good) => {
      const supplyFactor = good.available < 50 ? 1.2 : 0.8; // Example logic
      const demandFactor = factors.demandMultiplier || 1;
      good.priceMultiplier = supplyFactor * demandFactor;
      good.currentPrice = Math.round(good.basePrice * good.priceMultiplier);
    });
  }

  spendPoints(attributeKey, amount = 1) {
    // Find the category containing the attribute
    const category = this.categories.find(
      (category) => category.attributes[attributeKey]
    );

    if (!category) {
      console.warn(`Attribute "${attributeKey}" does not exist.`);
      return false;
    }

    const attribute = category.attributes[attributeKey];
    const cost = attribute.settlementPointCost;

    // Check if settlement points are sufficient
    if (this.settlementPoints < cost) {
      console.warn(
        `Insufficient settlement points. Required: ${cost}, Available: ${this.settlementPoints}`
      );
      return false;
    }

    // Spend settlement points and adjust the attribute value
    this.settlementPoints -= cost;
    category.adjustValue(attributeKey, amount);

    console.log(
      `Spent ${cost} settlement points to adjust "${attributeKey}" by ${amount}.`
    );

    return true;
  }

  adjustSettlementPoints(value, type = 'increase') {
    const delta = type === 'increase' ? value : -value;
    this.settlementPoints = Math.max(0, this.settlementPoints + delta);
  }

  applyImpacts(source, settlement, eventLog) {
    const { costs, rewards } = source.impacts;

    const handleImpact = (impact) => {
      const { type, category, attribute, key, baseAmount, immutable } = impact;

      // Calculate the final impact value
      const finalAmount = immutable
        ? baseAmount
        : eventLog.calculateEventImpact(source, settlement, impact);

      switch (type) {
        case 'category': {
          // Handle impacts on category attributes
          const categoryObj = settlement.categories.find(
            (cat) => cat.name === category
          );
          if (!categoryObj) {
            console.warn(`Category "${category}" not found in settlement.`);
            return;
          }

          const attrObj = attribute ? categoryObj.attributes[attribute] : null;
          if (attrObj && key) {
            attrObj.values[key] = Math.max(
              0,
              (attrObj.values[key] || 0) + finalAmount
            );
          } else {
            console.warn(
              `Attribute "${attribute}" or key "${key}" not found in category "${category}".`
            );
          }
          break;
        }

        case 'settlement': {
          // Handle settlement-wide impacts
          const settlementHandlers = {
            settlementPoints: () =>
              (settlement.settlementPoints = Math.max(
                0,
                settlement.settlementPoints + finalAmount
              )),
            gold: () => settlement.vault.adjustGold(finalAmount),
            health: () => settlement.health.adjustHealth(finalAmount),
          };

          const handler = settlementHandlers[attribute];
          if (handler) {
            handler();
          } else {
            console.warn(`Unknown settlement attribute: "${attribute}"`);
          }
          break;
        }

        case 'status': {
          // Handle impacts on statuses
          const statusObj = settlement.statuses.find(
            (s) => s.name === category
          );
          if (statusObj) {
            statusObj.adjustStep(finalAmount);
          } else {
            console.warn(`Status "${category}" not found in settlement.`);
          }
          break;
        }

        default:
          console.warn(`Unknown impact type: "${type}".`);
          break;
      }
    };

    // Process costs and rewards
    costs.forEach(handleImpact);
    rewards.forEach(handleImpact);
  }
}

export default Settlement;
