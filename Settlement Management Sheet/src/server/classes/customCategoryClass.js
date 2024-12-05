export default class CustomCategory {
  constructor(name, level, attributes, thresholds, dependencies, type = 'custom') {
    this.name = name;
    this.type = type;
    this.thresholds = thresholds;
    this.rating = undefined;
    this.bonus = 0;
    this._maxScoreCache = null;
    this.dependencies = dependencies || [];
    this.attributes = {};
    this.initializeAttributes(attributes, level);
    this.initializeHandlers();
  }

  initializeAttributes(attributes, level) {
    attributes.forEach(attr => {
      if (attr.attrition.enabled && attr.retention.enabled) {
        throw new Error(`Attribute "${attr.name}" cannot have both attrition and retention enabled.`);
      }

      const key = attr.name.toLowerCase().replace(/\s/g, '');
      this.attributes[key] = {
        name: attr.name,
        values: {
          current: attr.startingValue,
          max: this.calculateMax(level, attr.startingBonus, attr.maxPerLevel),
          bonus: attr.startingBonus,
        },
        costPerLevel: attr.costPerLevel,
        attrition: attr.attrition,
        retention: attr.retention,
        settlementPointCost: attr.settlementPointCost,
      };
    });
  }

  initializeHandlers() {
    Object.keys(this.attributes).forEach(attrKey => {
      this.costHandlers[attrKey] = value => this.adjustValue(attrKey, value, 'decrease');
      this.rewardHandlers[attrKey] = value => this.adjustValue(attrKey, value, 'increase');
      });
  }

  calculateMax(level, bonus, maxPerLevel) {
    return (level * maxPerLevel) + bonus;
  }

  adjustValue(attributeKey, value, type = 'increase') {
    const attr = this.attributes[attributeKey];
    if (!attr) {
      console.warn(`Attribute "${attributeKey}" does not exist.`);
      return;
    }

    const delta = type === 'increase' ? value : -value;
    attr.current = Math.max(0, Math.min(attr.max, attr.current + delta));
    this.invalidateMaxScoreCache();
  }


  setScore(level, currentHealth, maxHealth, modifiers = {}) {
    const baseline = Object.values(this.attributes).reduce((acc, attr) => {
      const clampedCurrent = Math.min(attr.current, attr.max);
      return acc + clampedCurrent;
    }, 0) / level;

    const healthFactor = currentHealth / maxHealth;
    const modifier = modifiers[this.name] || 1;

    this.score = (baseline * healthFactor * modifier).toFixed(1);
  }

  setRating() {
    this.rating = this.thresholds.find(threshold => this.score <= threshold.max)?.rating || "Unknown";
  }

  normalizeScore(rawScore, maxScore) {
    return (rawScore / maxScore) * 10;
  }

  calculateMaxScore() {
        if (!this._maxScoreCache) {
        this._maxScoreCache = Object.values(this.attributes).reduce((total, attr) => total + (attr.max || 0), 0);
    }
    return this._maxScoreCache;
}

invalidateMaxScoreCache() {
    this._maxScoreCache = null;
}

  getRatingFromScore(rawScore) {
    const maxScore = this.calculateMaxScore();
    const normalizedScore = this.normalizeScore(rawScore, maxScore);
    const rating = this.thresholds.find(range => normalizedScore <= range.max);
    return rating ? rating.label : "Unknown";
}

  applyAttrition(trigger, daysPassed) {
    const relevantAttributes = Object.values(this.attributes).filter(attr => attr.attrition.enabled);
    relevantAttributes.forEach(attr => {
      const { attrition } = attr;
      const intervalMap = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
      };

      const interval = intervalMap[trigger];
      if (!interval) {
        console.warn(`Invalid trigger "${trigger}" provided.`);
        return;
      }

      if (daysPassed % interval === 0) {
        attr.current = Math.max(0, attr.current - attrition.attritionRate);
      }
    });
  }

  applyRetention(trigger, daysPassed) {
    const relevantAttributes = Object.values(this.attributes).filter(attr => attr.retention.enabled);
    relevantAttributes.forEach(attr => {
      const { retention } = attr;
      const intervalMap = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
      };

      const interval = intervalMap[trigger];
      if (!interval) {
        console.warn(`Invalid trigger "${trigger}" provided.`);
        return;
      }

      if (daysPassed % interval === 0) {
        attr.current = Math.min(attr.max, attr.current + retention.retentionRate);
      }
    });
  }

  applyDependencies(allCategories) {
    this.dependencies.forEach(dep => {
        const targetCategory = allCategories[dep.target];
        if (!targetCategory) return;

        const conditionMet = this.evaluateCondition(dep.condition, targetCategory);

        if (conditionMet) {
            const { attribute, modifier } = dep.effect;
            this.adjustValue(attribute, this[attribute] * (modifier - 1), 'increase');
        }
    });
  }
}
