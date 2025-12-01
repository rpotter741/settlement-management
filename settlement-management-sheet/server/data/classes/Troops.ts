export default class Troop {
  constructor({
    name,
    attackBonus = 0,
    damage = 0,
    armor = 0,
    reflexSave = 0,
    health = 100,
    maxHealth = 100,
    notes = '',
    color = '#000000',
    customProperties = {},
  }) {
    this.id = `troop-${Date.now()}`;
    this.name = name;
    this.attackBonus = attackBonus;
    this.damage = damage;
    this.armor = armor;
    this.reflexSave = reflexSave;
    this.health = health;
    this.maxHealth = maxHealth;
    this.notes = notes;
    this.color = color;
    this.customProperties = customProperties;

    this.deployed = false;
    this.location = null; // Deployment location
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  adjustStat(stat, value) {
    if (this[stat] !== undefined) {
      this[stat] += value;
    } else if (this.customProperties[stat] !== undefined) {
      this.customProperties[stat] += value;
    } else {
      console.warn(`Stat "${stat}" does not exist.`);
    }
  }

  deploy(location) {
    this.deployed = true;
    this.location = location;
  }

  returnFromDeployment() {
    this.deployed = false;
    this.location = null;
  }
}
