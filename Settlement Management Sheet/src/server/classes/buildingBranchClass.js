class Branch {
  constructor({
    name,
    level,
    description = '',
    costs = {},
    rewards = {},
    next = [], // Array of potential next branches
  }) {
    this.name = name;
    this.level = level;
    this.description = description;
    this.costs = costs;
    this.rewards = rewards;
    this.next = next; // Array of potential branches for branching paths
  }

  addNext(branch) {
    this.next.push(branch);
  }
}

export default Branch;
