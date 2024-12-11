export default class Health {
  constructor() {
    this.current = 100;
    this.maxHealthBase = 100;
    this.maxHealthBonus = 0;
    this.levelBonuses = {};
  }

  setHealth(value) {
    this.current = Math.min(Math.max(value, 0), this.totalMaxHealth());
  }

  heal(value) {
    this.current = Math.min(this.current + value, this.totalMaxHealth());
  }

  damage(value) {
    this.current = Math.max(this.current - value, 0);
  }

  batchUpdate(changes) {
    changes.forEach((change) => {
      const { type, value } = change;
      switch (type) {
        case 'set':
          this.setHealth(value);
          break;
        case 'heal':
          this.heal(value);
          break;
        case 'damage':
          this.damage(value);
          break;
        case 'maxBonusPlus':
          this.maxBonusPlus(value);
          break;
        case 'maxBonusMinus':
          this.maxBonusMinus(value);
          break;
        default:
          console.warn(`Unknown change type: ${type}`);
      }
    });
  }

  maxBonusPlus(value) {
    this.maxHealthBonus += value;
  }

  maxBonusMinus(value) {
    this.maxHealthBonus -= value;
  }

  maxBaseChange(value) {
    this.maxHealthBase = value;
  }

  totalMaxHealth() {
    return this.maxHealthBase + this.maxHealthBonus;
  }

  setLevelBonus(level, effects) {
    this.levelBonuses[level] = effects;
  }

  applyBonuses(level) {
    const applicableBonuses = Object.entries(this.levelBonuses)
      .filter(([bonusLevel]) => parseInt(bonusLevel) <= level)
      .map(([, effects]) => effects);

    // Reset max health bonus before reapplying
    this.maxHealthBonus = 0;

    // Apply all applicable bonuses
    applicableBonuses.forEach((effects) => {
      Object.entries(effects).forEach(([key, value]) => {
        if (key === 'maxHealthBonus') {
          this.maxHealthBonus += value;
        } else if (key === 'current') {
          this.current += value;
        }
        // Add handling for other effects if needed.
      });
    });
  }

  removeLevelBonus(level) {
    delete this.levelBonuses[level];
  }

  getBonuses() {
    return this.levelBonuses;
  }
}
