export default class Branch {
  constructor({
    name,
    level,
    description = '',
    phases = [], // Array of phase objects
    mutuallyExclusive = true, // Whether selecting this branch blocks others
    next = [], // Array of potential next branches
  }) {
    this.name = name;
    this.level = level;
    this.description = description;
    this.phases = phases;
    this.mutuallyExclusive = mutuallyExclusive;
    this.next = next;
  }

  addPhase(phase) {
    this.phases.push(phase);
  }

  generateEventPhases() {
    return this.phases.map((phase) => ({
      name: phase.name,
      details: phase.description,
      timeInDays: phase.timeInDays,
      laborNeeded: phase.laborNeeded,
      costs: phase.costs,
      rewards: phase.rewards,
    }));
  }
}

/*
const clearingDebrisPhase = {
  name: 'Clearing Debris',
  description: 'Removing debris to prepare for wall construction.',
  timeInDays: 3,
  laborNeeded: 5,
  costs: [{ name: 'gold', quantity: 10 }],
  rewards: [],
  completed: false,
};

const buildingWallPhase = {
  name: 'Building Wall',
  description: 'Constructing the wall using stone and mortar.',
  timeInDays: 7,
  laborNeeded: 10,
  costs: [{ name: 'stone', quantity: 50 }, { name: 'gold', quantity: 30 }],
  rewards: [{ name: 'defensiveInfrastructure', quantity: 10 }],
  completed: false,
};

const reinforcedWalls = new Branch({
  name: 'Reinforced Walls',
  level: 2,
  description: 'Upgrade the walls to withstand stronger attacks.',
  phases: [clearingDebrisPhase, buildingWallPhase],
});

*/
