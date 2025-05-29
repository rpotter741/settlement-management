export default class UpgradeTree {
  constructor({ name, description = '', upgrades = [] }) {
    this.name = name;
    this.description = description;
    this.upgrades = upgrades; // Array of Upgrade objects
    this.activeUpgrades = []; // List of selected upgrade IDs
  }

  // Get all upgrades available at a given level
  getAvailableUpgrades(level) {
    return this.upgrades.filter(
      (upgrade) =>
        !this.activeUpgrades.includes(upgrade.id) &&
        upgrade.isAvailable(level, this.activeUpgrades)
    );
  }

  checkRequirements(upgradeId) {
    const upgrade = this.upgrades.find((up) => up.id === upgradeId);
    if (!upgrade) return false;
    return upgrade.requirements.every((reqId) =>
      this.activeUpgrades.includes(reqId)
    );
  }

  // Select an upgrade and apply its effects
  selectUpgrade(upgradeId, settlement) {
    const upgrade = this.upgrades.find((up) => up.id === upgradeId);
    if (!upgrade) {
      console.warn(`Upgrade with ID "${upgradeId}" not found.`);
      return false;
    }
    if (upgrade.isAvailable(settlement.level, this.activeUpgrades)) {
      upgrade.applyEffect(settlement);
      this.activeUpgrades.push(upgradeId);
      return true;
    } else {
      console.warn(`Upgrade "${upgrade.name}" is not available.`);
      return false;
    }
  }

  // Deselect an upgrade and remove its effects
  deselectUpgrade(upgradeId, settlement) {
    const upgrade = this.upgrades.find((up) => up.id === upgradeId);
    if (!upgrade) {
      console.warn(`Upgrade with ID "${upgradeId}" not found.`);
      return false;
    }
    upgrade.removeEffect(settlement);
    this.activeUpgrades = this.activeUpgrades.filter((id) => id !== upgradeId);
    return true;
  }

  getUpgradesByType(type) {
    return this.upgrades.filter((upgrade) => upgrade.type === type);
  }
  getActiveUpgrades() {
    return this.upgrades.filter((upgrade) =>
      this.activeUpgrades.includes(upgrade.id)
    );
  }

  resetAll(settlement) {
    this.activeUpgrades.forEach((id) => {
      const upgrade = this.upgrades.find((up) => up.id === id);
      if (upgrade) upgrade.removeEffect(settlement);
    });
    this.activeUpgrades = [];
  }
}
