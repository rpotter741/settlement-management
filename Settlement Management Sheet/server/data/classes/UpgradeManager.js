class UpgradeManager {
  constructor() {
    this.upgrades = new Map(); // Keys are levels, values are arrays of upgrades
    this.selectedUpgrades = new Set(); // Track applied upgrades
  }

  // Add upgrades to a specific level
  addUpgrade(level, upgrade) {
    if (!this.upgrades.has(level)) {
      this.upgrades.set(level, []);
    }
    this.upgrades.get(level).push(upgrade);
  }

  // Get upgrades for a specific level
  getUpgradesByLevel(level) {
    return this.upgrades.get(level) || [];
  }

  // Select an upgrade to apply
  selectUpgrade(upgradeId) {
    this.selectedUpgrades.add(upgradeId);
  }

  // Check if an upgrade is already selected
  isUpgradeSelected(upgradeId) {
    return this.selectedUpgrades.has(upgradeId);
  }
}
