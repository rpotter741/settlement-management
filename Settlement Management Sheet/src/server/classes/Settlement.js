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
  // want some broken code? Here you go. This will need reworked based on changed structure, but we're getting ideas down right now.
  applyImpacts(event) {
    event.impacts.forEach(({ resource, baseAmount, penaltyPerMissing }) => {
      const available = this[resource] || 0;
      const shortfall = Math.max(0, baseAmount - available);
      this[resource] -= baseAmount - shortfall;

      if (penaltyPerMissing && shortfall > 0) {
        this.health -= shortfall * penaltyPerMissing; // Apply penalties
      }
    });
  }
}

export default Settlement;
