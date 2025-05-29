export default class Roster {
  constructor() {
    this.troops = []; // All troops in the settlement
  }

  // Add a new troop to the roster
  addTroop(troop, status = 'idle', location = null) {
    this.troops.push({
      ...troop,
      status: status, // Default status
      location: location, // Default location
    });
  }

  // Remove a troop from the roster by ID
  removeTroop(troopId) {
    this.troops = this.troops.filter((troop) => troop.id !== troopId);
  }

  // Update the status and location of a troop
  updateTroopStatus(troopId, status, location = null) {
    const troop = this.troops.find((t) => t.id === troopId);
    if (troop) {
      troop.status = status;
      troop.location = location;
    } else {
      console.warn(`Troop with ID "${troopId}" not found.`);
    }
  }

  // Get all troops by their status (e.g., "idle", "stationed", "deployed")
  getTroopsByStatus(status) {
    return this.troops.filter((troop) => troop.status === status);
  }

  // Get all troops stationed at a specific location
  getTroopsByLocation(location) {
    return this.troops.filter((troop) => troop.location === location);
  }

  // Retrieve troop by ID
  getTroopById(troopId) {
    return this.troops.find((troop) => troop.id === troopId) || null;
  }

  // Get a summary of troop counts by status
  getTroopSummary() {
    const summary = {};
    this.troops.forEach((troop) => {
      summary[troop.status] = (summary[troop.status] || 0) + 1;
    });
    return summary;
  }
}
