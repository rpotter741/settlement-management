class Building {
  constructor({
    name,
    description = '',
    level = 0,
    status = 'Not Built',
    branches = [], // Array of initial branches
    official = false,
  }) {
    this.name = name;
    this.description = description;
    this.level = level;
    this.status = status;
    this.branches = branches; // Starting branches
    this.official = official; // Whether this is a default/predefined building
  }

  addBranch(branch) {
    this.branches.push(branch);
  }

  findBranch(name) {
    const stack = [...this.branches];
    while (stack.length) {
      const branch = stack.pop();
      if (branch.name === name) return branch;
      if (branch.next.length) stack.push(...branch.next); // Traverse all next branches
    }
    return null;
  }

  upgrade(branchName) {
    const branch = this.findBranch(branchName);
    if (branch) {
      this.level = branch.level;
      this.status = `Upgraded to ${branch.name}`;
      this.costs = branch.costs;
      this.rewards = branch.rewards;
    } else {
      throw new Error(`Branch "${branchName}" not found.`);
    }
  }
}

export default Building;

/*
  const Walls = new Building({
    name: 'Walls',
    description: 'Basic walls to protect the settlement.',
    level: 1,
    costs: { stone: 100, gold: 50 },
    rewards: { defensiveInfrastructure: 5 },
    branches: [reinforcedWalls],
    official: true,
  });
*/
