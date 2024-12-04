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
        this.importFilter = [
            "economy bonus",
            "trade",
            "trade bonus",
            "craftsmanship",
            "craftsmanship bonus",
            "labor pool",
            "labor pool bonus"
        ]
    }

    setTradeCurrent(value) {
        this.tradeCurrent = value;
    }

    tradeCurrentUp(value) {
        this.tradeCurrent += value;
    }

    tradeCurrentDown(value) {
        this.tradeCurrent -= value;
    }

    setTradeBonus(value) {
        this.tradeBonus = value;
    }

    tradeBonusUp(value) {
        this.tradeBonus += value;
        this.tradeCurrentUp(value);
    }

    tradeBonusDown(value) {
        this.tradeBonus -= value;
        this.tradeCurrentDown(value);
    }

    setTradeMax(level) {
        this.tradeMax = (level * 5) + this.tradeBonus + this.bonus;
    }

    setCraftsmanshipCurrent(value) {
        this.productivityCurrent = value;
    }

    craftsmanshipCurrentUp(value) {
        this.productivityCurrent += value;
    }

    craftsmanshipCurrentDown(value) {
        this.productivityCurrent -= value;
    }

    setCraftsmanshipBonus(value) {
        this.productivityBonus = value;
    }

    craftsmanshipBonusUp(value) {
        this.productivityBonus += value;
        this.productivityCurrentUp(value);
    }

    craftsmanshipBonusDown(value) {
        this.productivityBonus -= value;
        this.productivityCurrentDown(value);
    }

    setCraftsmanshipMax(level) {
        this.productivityMax = (level * 3) + this.productivityBonus + this.bonus;
    }

    setLaborPoolCurrent(value) {
        this.laborPoolCurrent = value;
    }

    laborPoolCurrentUp(value) {
        this.laborPoolCurrent += value;
    }

    laborPoolCurrentDown(value) {
        this.laborPoolCurrent -= value;
    }

    setLaborPoolBonus(value) {
        this.laborPoolBonus = value;
    }

    laborPoolBonusUp(value) {
        this.laborPoolBonus += value;
        this.laborPoolCurrentUp(value);
    }

    laborPoolBonusDown(value) {
        this.laborPoolBonus -= value;
        this.laborPoolCurrentDown(value);
    }

    setLaborPoolMax(level) {
        this.laborPoolMax = (level * 2) + this.laborPoolBonus + this.bonus;
    }


    setBonus(value) {
        this.bonus = value;
    }

    bonusUp(value) {
        this.bonus += value;
        this.tradeCurrentUp(value);
        this.craftsmanshipCurrentUp(value);
        this.laborPoolCurrentUp(value);
    }

    bonusDown(value) {
        this.bonus -= value;
        this.tradeCurrentDown(value);
        this.craftsmanshipCurrentDown(value);
        this.laborPoolCurrentDown(value);
    }

    setMax(level) {
        this.setTradeMax(level);
        this.setCraftsmanshipMax(level);
        this.setLaborPoolMax(level);
    }

    setScore(level, currentHealth, maxHealth, safetyRating) {
        this.setMax(level);

        // intializes variables;
        let trade;
        let craftsmanship;
        let laborPool;

        // use trade max if trade current is higher
        if(this.tradeCurrent > this.tradeMax) {
            trade = this.tradeMax;
        } else {
            trade = this.tradeCurrent;
        }

        // use craftsmanship max if craftsmanship current is higher;
        if(this.craftsmanshipCurrent > this.craftsmanshipMax) {
            craftsmanship = this.craftsmanshipMax;
        } else {
            craftsmanship = this.craftsmanshipCurrent;
        }

        // use labor pool max if labor pool current is higher;
        if (this.laborPoolCurrent > this.laborPoolMax) {
            laborPool = this.laborPoolMax;
        } else {
            laborPool = this.laborPoolCurrent;
        }

        // create a value >= 0 for rating calculation
        const temp = (((trade + craftsmanship + laborPool) / level) * (currentHealth / maxHealth));

        switch(safetyRating) {
            case "Dangerous":
                this.score = (temp * 0.2).toFixed(1);
                break;
            case "Lawless":
                this.score = (temp * 0.5).toFixed(1);
                break;
            case "Unsafe":
                this.score = (temp * 0.9).toFixed(1);
                break;
            case "Safe":
                this.score = (temp).toFixed(1);
                break;
            case "Guarded":
                this.score = (temp * 1.05).toFixed(1);
                break;
            case "Protected":
                this.score = (temp * 1.1).toFixed(1);
                break;
            case "Impregnable":
                this.score = (temp * 1.2).toFixed(1);
                break;
            default:
                this.score = undefined;
        }
    }

    getScore() {
        return this.score;
    }

    setRating() {
        const value = this.score;

        if(value <= 1) {
            this.rating = "Struggling";
        } else if(value > 1 && value <= 2) {
            this.rating = "Fragile";
        } else if(value > 2 && value <= 3) {
            this.rating = "Stagnant";
        } else if(value > 3 && value <= 4) {
            this.rating = "Growing";
        } else if(value > 4 && value <= 5) {
            this.rating = "Prosperous";
        } else if(value > 5 && value < 6.5) {
            this.rating = "Thriving";
        } else if(value >= 6.5) {
            this.rating = "Golden Era";
        }
    }

    getRating() {
        return this.rating;
    }

    costImpact(data) {
        // filters through object to match economy components
        // and bring them down with their respective values;
        const keys = Object.keys(data);
        const values = Object.values(data);
        for(let i = 0; i < keys.length; i += 1) {
            if(this.importFilter.indexOf(keys[i]) !== -1) {
                if(keys[i] === "economy bonus") {
                    this.bonusDown(values[i]);
                } else if(keys[i] === "trade") {
                    this.tradeCurrentDown(values[i]);
                } else if(keys[i] === "trade bonus") {
                    this.tradeBonusDown(values[i]);
                } else if(keys[i] === "craftsmanship") {
                    this.craftsmanshipCurrentDown(values[i]);
                } else if(keys[i] === "craftsmanship bonus") {
                    this.craftsmanshipBonusDown(values[i]);
                } else if (keys[i] === "labor pool") {
                    this.laborPoolCurrentDown(values[i]);
                } else if (keys[i] === "labor pool bonus") {
                    this.laborPoolBonusDown(values[i]);
                }
            }
        }
    }

    reward(data) {
        // filters through object to match economy components
        // and bring them up with their respective values;
        const keys = Object.keys(data);
        const values = Object.values(data);
        for(let i = 0; i < keys.length; i += 1) {
            if(this.importFilter.indexOf(keys[i]) !== -1) {
                if(keys[i] === "economy bonus") {
                    this.bonusUp(values[i]);
                } else if(keys[i] === "trade") {
                    this.tradeCurrentUp(values[i]);
                } else if(keys[i] === "trade bonus") {
                    this.tradeBonusUp(values[i]);
                } else if(keys[i] === "craftsmanship") {
                    this.craftsmanshipCurrentUp(values[i]);
                } else if(keys[i] === "craftsmanship bonus") {
                    this.craftsmanshipBonusUp(values[i]);
                } else if (keys[i] === "labor pool") {
                    this.laborPoolCurrentUp(values[i]);
                } else if (keys[i] === "labor pool bonus") {
                    this.laborPoolBonusUp(values[i]);
                }
            }
        }
    }
}