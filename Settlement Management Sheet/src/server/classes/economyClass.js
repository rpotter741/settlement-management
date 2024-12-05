export default class Economy {
    constructor() {
        this.bonus = 0;
        this.tradeCurrent = 0;
        this.tradeBonus = 0;
        this.tradeMax = 0;
        this.craftsmanshipCurrent = 0;
        this.craftsmanshipBonus = 0;
        this.craftsmanshipMax = 0;
        this.laborPoolCurrent = 0;
        this.laborPoolBonus = 0;
        this.laborPoolMax = 0;
        this.rating = undefined;
        this.score = undefined;
        this.initializeHandlers();
    }

    getAttributeKey = (attribute) => {
        const map = {
            "economy bonus": "bonus",
            "trade": "tradeCurrent",
            "trade bonus": "tradeBonus",
            "craftsmanship": "craftsmanshipCurrent",
            "craftsmanship bonus": "craftsmanshipBonus",
            "labor pool": "laborPoolCurrent",
            "labor pool bonus": "laborPoolBonus"
        };

        return map[attribute];
    }

    initializeHandlers = () => {
        const attributes = [
            'economy bonus',
            'trade',
            'trade bonus',
            'craftsmanship',
            'craftsmanship bonus',
            'labor pool',
            'labor pool bonus'
        ]

        this.costHandlers = {};
        this.rewardHandlers = {};

        attributes.forEach(attr => {
            this.costHandlers[attr] = (value) => this.adjustValue(this.getAttributeKey(attr), value, 'decrease');
            this.rewardHandlers[attr] = (value) => this.adjustValue(this.getAttributeKey(attr), value);
        });
    }

    setValue(property, value) {
        this[property] = value;
    }

    adjustValue(property, value, type = 'increase') {
        if (this[property] === undefined) {
            return;
        }
        this[property] += type === 'increase' ? value : -value;
    }

    setTradeMax(level) {
        this.tradeMax = (level * 5) + this.tradeBonus + this.bonus;
    }

    setCraftsmanshipMax(level) {
        this.craftsmanshipMax = (level * 3) + this.craftsmanshipBonus + this.bonus;
    }

    setLaborPoolMax(level) {
        this.laborPoolMax = (level * 2) + this.laborPoolBonus + this.bonus;
    }

    bonusUp(value) {
        this.bonus += value;
        this.adjustValue('tradeCurrent', value);
        this.adjustValue('craftsmanshipCurrent', value);
        this.adjustValue('laborPoolCurrent', value);
    }

    bonusDown(value) {
        this.bonus -= value;
        this.adjustValue('tradeCurrent', value, 'decrease');
        this.adjustValue('craftsmanshipCurrent', value, 'decrease');
        this.adjustValue('laborPoolCurrent', value, 'decrease');
    }

    setMax(level) {
        this.setTradeMax(level);
        this.setCraftsmanshipMax(level);
        this.setLaborPoolMax(level);
    }

    clampCurrentToMax(current, max) {
        return current > max ? max : current;
    }

    setScore(level, currentHealth, maxHealth, safetyRating) {
        // sets max values based on level
        this.setMax(level);

        // initializes variables;
        const trade = this.clampCurrentToMax(this.tradeCurrent, this.tradeMax);
        const craftsmanship = this.clampCurrentToMax(this.craftsmanshipCurrent, this.craftsmanshipMax);
        const laborPool = this.clampCurrentToMax(this.laborPoolCurrent, this.laborPoolMax);

        // create a value >= 0 for rating calculation
        const baseline = (((trade + craftsmanship + laborPool) / level) * (currentHealth / maxHealth));

        const safetyModifiers = {
            Dangerous: 0.2,
            Lawless: 0.5,
            Unsafe: 0.9,
            Safe: 1.0,
            Guarded: 1.05,
            Protected: 1.1,
            Impregnable: 1.2,
        };

        this.score = (baseline * (safetyModifiers[safetyRating] || 1)).toFixed(1);
    }

    getScore() {
        return this.score;
    }

    setRating() {
    const thresholds = [
        { max: 1, rating: "Struggling" },
        { max: 2, rating: "Fragile" },
        { max: 3, rating: "Stagnant" },
        { max: 4, rating: "Growing" },
        { max: 5, rating: "Prosperous" },
        { max: 6.5, rating: "Thriving" },
        { max: Infinity, rating: "Golden Era" },
    ];

    this.rating = thresholds.find(threshold => this.score <= threshold.max)?.rating || "Unknown";
}

    getRating() {
        return this.rating;
    }

    costImpact(data) {
        Object.entries(data).forEach(([key, value]) => {
            if (this.costHandlers[key]) {
                this.costHandlers[key](value);
            }
        });
    }

    reward(data) {
        Object.entries(data).forEach(([key, value]) => {
            if (this.rewardHandlers[key]) {
                this.rewardHandlers[key](value);
            }
        });
    }
}