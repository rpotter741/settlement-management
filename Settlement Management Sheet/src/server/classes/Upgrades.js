export default class Upgrade {
  constructor({
    id,
    name,
    description = '',
    level,
    requirements = [],
    effects = {},
    type, // E.g., "Settlement Type", "Passive Effect", etc.
    cost = {}, // Optional: costs associated with the upgrade
    passive = false,
  }) {
    this.id = id || `upgrade-${Date.now()}`;
    this.name = name;
    this.description = description;
    this.level = level; // Determines when it becomes available
    this.requirements = requirements; // Prerequisite upgrades by id
    this.effects = effects; // Effects the upgrade applies
    this.type = type; // Classification for querying/updating
    this.cost = cost; // Resource costs
    this.passive = passive; // Passive effect or triggered
    this.selected = false; // Tracks if the upgrade is active
  }

  // Apply the upgrade's effects
  applyEffect(settlement) {
    Object.entries(this.effects).forEach(([target, value]) => {
      if (target in settlement) {
        settlement[target] += value;
      } else if (settlement.categories[target]) {
        settlement.categories[target].bonus += value;
      }
    });
    this.selected = true;
  }

  // in a couple weeks when this doesn't work, you'll know you chose not to change it even though you thought about it at 1046 on dec 8. You goon.
  canAfford(settlement) {
    return Object.entries(this.cost).every(
      ([resource, amount]) => settlement.resources[resource] >= amount
    );
  }

  // Remove the upgrade's effects
  removeEffect(settlement) {
    Object.entries(this.effects).forEach(([target, value]) => {
      if (target in settlement) {
        settlement[target] -= value;
      } else if (settlement.categories[target]) {
        settlement.categories[target].bonus -= value;
      }
    });
    this.selected = false;
  }

  // Check if this upgrade is available for selection
  isAvailable(level, activeUpgrades) {
    return level >= this.level && this.checkRequirements(activeUpgrades);
  }
}
