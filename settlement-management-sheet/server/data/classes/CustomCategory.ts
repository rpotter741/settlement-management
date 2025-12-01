export default class CustomCategory {
  constructor(
    name,
    level,
    attributes,
    thresholds,
    dependencies,
    type = 'custom'
  ) {
    this.name = name; // name of the category
    this.attributes = {}; // object to hold attribute objects
    this.thresholds = thresholds; // array of threshold objects
    this.rating = undefined; // current rating, a string
    this.dependencies = dependencies || []; // a list of dependency objects
    this.bonus = 0; // global bonus to all attributes
    this._type = type; //type is either official or custom
    this._maxScoreCache = null; // private variable cache for max score
    this.initializeAttributes(attributes, level); // initialize attributes
    this.initializeHandlers(); // initialize handlers
  }

  // Initialization
  initializeAttributes(attributes, level) {
    attributes.forEach((attr) => {
      if (attr.attrition.enabled && attr.retention.enabled) {
        throw new Error(
          `Attribute "${attr.name}" cannot have both attrition and retention enabled.`
        );
      }

      const key = attr.name.toLowerCase().replace(/\s/g, '');
      this.attributes[key] = {
        name: attr.name,
        values: {
          current: attr.startingValue,
          maxPerLevel: attr.maxPerLevel,
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

  /*
    Example attribute object:
    {
    name: 'Food',
    values: {
      current: 3,
      maxPerLevel: 5,
      max: 5,
      bonus: 0
    },
    costPerLevel: 35,
    attrition: {
      enabled: true,
      rate: 1,
      interval: 'weekly'
    },
    retention: {
      enabled: false,
      rate: null,
      interval: null
    },
    settlementPointCost: {
    default: 1,
    'Survivalist': 1,
    'Fortified': 2,
    'Mercantile': 1}
  */

  /*
      Example threshold object:
      { max: 3.9, rating: "Endangered" }
    */

  /*
        Example dependency object:
        {
          target: 'Survival',
          conditions: [
            { rating: 'Dying', modifier: 0.5 },
            { rating: 'Endangered', modifier: 0.75 }
          ]
        }
      */

  initializeHandlers() {
    Object.keys(this.attributes).forEach((attrKey) => {
      this.costHandlers[attrKey] = (value) =>
        this.adjustValue(attrKey, value, 'decrease');
      this.rewardHandlers[attrKey] = (value) =>
        this.adjustValue(attrKey, value, 'increase');
    });
  }

  // adjustments to attributes
  adjustValue(attributeKey, value, type = 'increase') {
    const attr = this.attributes[attributeKey];
    if (!attr) {
      console.warn(`Attribute "${attributeKey}" does not exist.`);
      return;
    }

    const { values } = attr;
    const delta = type === 'increase' ? value : -value;
    values.current = Math.max(0, Math.min(values.max, values.current + delta));
    this.invalidateMaxScoreCache();
  }

  adjustBonus(attribute, value, type = 'increase', global = false) {
    const delta = type === 'increase' ? value : -value;

    if (global) {
      this.bonus += delta;
      Object.values(this.attributes).forEach((attr) => {
        attr.current = Math.max(0, attr.current + delta);
      });
    } else {
      const attr = this.attributes[attribute];
      if (!attr) {
        console.warn(`Attribute "${attribute}" does not exist.`);
        return;
      }
      attr.values.bonus = Math.max(0, attr.values.bonus + delta);
      attr.values.current = Math.min(
        attr.values.max,
        attr.values.current + delta
      );
    }
    this.invalidateMaxScoreCache();
  }

  // scoring and rating
  setScore(
    level,
    currentHealth,
    maxHealth,
    allCategories,
    weatherModifiers = {}
  ) {
    // Step 1: Start with raw score
    const baseline =
      Object.values(this.attributes).reduce((acc, attr) => {
        const clampedCurrent = Math.min(attr.values.current, attr.values.max);
        return acc + clampedCurrent;
      }, 0) / level;

    const healthFactor = currentHealth / maxHealth;

    // Step 2: Collect all modifiers
    const modifiers = { ...weatherModifiers }; // Start with weather modifiers
    this.applyDependencies(allCategories, modifiers); // Add dependency modifiers to modifiers object

    // Step 3: Combine all modifiers into a single multiplier
    const totalModifier = Object.values(modifiers).reduce(
      (acc, modifier) => acc * modifier,
      1
    );

    // Step 4: Calculate final score
    this.rawScore = baseline * healthFactor;
    this.score = (this.rawScore * totalModifier).toFixed(1);

    // Step 5: Update rating
    this.setRating();
  }

  setRating() {
    this.rating =
      this.thresholds.find((threshold) => this.score <= threshold.max)
        ?.rating || 'Unknown';
  }

  normalizeScore(rawScore, maxScore) {
    return (rawScore / maxScore) * 10;
  }

  calculateMaxScore() {
    if (!this._maxScoreCache) {
      this._maxScoreCache = Object.values(this.attributes).reduce(
        (total, attr) => total + (attr.max || 0),
        0
      );
    }
    return this._maxScoreCache;
  }

  invalidateMaxScoreCache() {
    this._maxScoreCache = null;
  }

  getRatingFromScore(rawScore) {
    const maxScore = this.calculateMaxScore();
    const normalizedScore = this.normalizeScore(rawScore, maxScore);
    const rating = this.thresholds.find(
      (range) => normalizedScore <= range.max
    );
    return rating ? rating.label : 'Unknown';
  }

  // attrition and retention
  applyAttrition(trigger, daysPassed) {
    const relevantAttributes = Object.values(this.attributes).filter(
      (attr) => attr.attrition.enabled
    );
    relevantAttributes.forEach((attr) => {
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
        attr.current = Math.max(0, attr.current - attrition.rate);
      }
    });
  }

  applyRetention(trigger, daysPassed) {
    const relevantAttributes = Object.values(this.attributes).filter(
      (attr) => attr.retention.enabled
    );
    relevantAttributes.forEach((attr) => {
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
        attr.current = Math.min(attr.max, attr.current + retention.rate);
      }
    });
  }

  // dependencies
  applyDependencies(allCategories, modifiers) {
    this.dependencies.forEach((dep) => {
      const targetCategory = allCategories[dep.target];
      if (!targetCategory) {
        console.warn(`Target category "${dep.target}" does not exist.`);
        return;
      }

      dep.conditions.forEach(({ rating, modifier }) => {
        if (targetCategory.rating === rating) {
          modifiers[dep.target] = modifier; // Add the modifier for the dependency
        }
      });
    });
  }

  evaluateCondition(condition, targetCategory) {
    const { attribute, operator, value } = condition;
    const targetValue = targetCategory[attribute];

    switch (operator) {
      case 'gt':
        return targetValue > value;
      case 'lt':
        return targetValue < value;
      case 'eq':
        return targetValue === value;
      default:
        console.warn(`Invalid operator "${operator}" provided.`);
        return false;
    }
  }

  // utility functions
  calculateMax(level, bonus, maxPerLevel) {
    return level * maxPerLevel + bonus;
  }
}
