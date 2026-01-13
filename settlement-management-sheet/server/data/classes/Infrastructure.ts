export default class Infrastructure {
  constructor(buildings) {
    this.buildings = buildings || []; // Array to hold Building instances
  }

  addBuilding(building) {
    this.buildings.push(building);
  }

  removeBuilding(name) {
    this.buildings = this.buildings.filter(
      (building) => building.name !== name
    );
  }

  findBuilding(name) {
    return this.buildings.find((building) => building.name === name) || null;
  }

  filterBuildingsByStatus(status) {
    return this.buildings.filter((building) => building.status === status);
  }

  calculateTotalCosts() {
    return this.buildings.reduce((acc, building) => {
      Object.keys(building.costs).forEach((costType) => {
        acc[costType] = (acc[costType] || 0) + building.costs[costType];
      });
      return acc;
    }, {});
  }

  upgradeBuilding(name, branchName) {
    const building = this.findBuilding(name);
    if (building) {
      building.upgrade(branchName);
    } else {
      throw new Error(`Building "${name}" not found.`);
    }
  }
}
