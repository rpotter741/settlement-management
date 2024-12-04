import diceRoll from "../helpers/diceRoll";

export default class Safety {
    constructor() {
        this.bonus = 0;
        this.defenseCurrent = 0;
        this.defenseBonus = 0;
        this.defenseMax = 0;
        this.intelCurrent = 0;
        this.intelBonus = 0;
        this.intelMax = 0;
        this.garrisonCurrent = 0;
        this.garrisonBonus = 0;
        this.garrisonMax = 0;
        this.rating = undefined;
        this.score = undefined;
        this.importFilter = [
            "safety bonus",
            "defense",
            "defense bonus",
            "intel",
            "intel bonus",
            "garrison",
            "garrison bonus"
        ]
    }


    setDefenseCurrent(value) {
        this.defenseCurrent = value;
    }

    defenseCurrentUp(value) {
        this.defenseCurrent += value;
    }

    defenseCurrentDown(value) {
        this.defenseCurrent -= value;
    }

    setDefenseBonus(value) {
        this.defenseBonus = value;
    }

    defenseBonusUp(value) {
        this.defenseBonus += value;
        this.defenseCurrentUp(value);
    }

    defenseBonusDown(value) {
        this.defenseBonus -= value;
        this.defenseCurrentDown(value);
    }

    setDefenseMax(level) {
        this.defenseMax = (level * 2) + this.defenseBonus + this.bonus;
    }

    setIntelCurrent(value) {
        this.intelCurrent = value;
    }

    intelCurrentUp(value) {
        this.intelCurrent += value;
    }

    intelCurrentDown(value) {
        this.intelCurrent -= value;
    }

    setIntelBonus(value) {
        this.intelBonus = value;
    }

    intelBonusUp(value) {
        this.intelBonus += value;
        this.intelCurrentUp(value);
    }

    intelBonusDown(value) {
        this.intelBonus -= value;
        this.intelCurrentDown(value);
    }

    setIntelMax(level) {
        this.intelMax = (level) + this.intelBonus + this.bonus;
    }

    setGarrisonCurrent(value) {
        this.garrisonCurrent = value;
    }

    garrisonCurrentUp(value) {
        this.garrisonCurrent += value;
    }

    garrisonCurrentDown(value) {
        this.garrisonCurrent -= value;
    }

    setGarrisonBonus(value) {
        this.garrisonBonus = value;
    }

    garrisonBonusUp(value) {
        this.garrisonBonus += value;
        this.garrisonCurrentUp(value);
    }

    garrisonBonusDown(value) {
        this.garrisonBonus -= value;
        this.garrisonCurrentDown(value);
    }

    setGarrisonMax(level) {
        this.garrisonMax = (level * 2) + this.garrisonBonus + this.bonus;
    }

    setBonus(value) {
        this.bonus = value;
    }

    bonusUp(value) {
        this.bonus += value;
        this.defenseCurrent += value;
        this.intelCurrent += value;
        this.garrisonCurrent += value;
    }

    bonusDown(value) {
        this.bonus -= value;
        this.defenseCurrent -= value;
        this.intelCurrent -= value;
        this.garrisonCurrent -= value;
    }

    setMax(level) {
        this.setDefenseMax(level);
        this.setIntelMax(level);
        this.setGarrisonMax(level);
    }

    setScore(level, currentHealth, maxHealth, survivalRating) {
        this.setMax(level);

        // intializes variables for holding values;
        let defense;
        let intel;
        let garrison;

        // Use Defense Max if Defense current is higher;
        if(this.defenseCurrent > this.defenseMax) {
            defense = this.defenseMax;
        } else {
            defense = this.defenseCurrent;
        }

        // Use Intel Max if Intel current is higher;
        if(this.intelCurrent > this.intelMax) {
            intel = this.intelMax;
        } else {
            intel = this.intelCurrent;
        }

        // Use Garrison Max if Garrison current is higher;
        if(this.garrisonCurrent > this.garrisonMax) {
            garrison = this.garrisonMax;
        } else {
            garrison = this.garrisonCurrent;
        }

        // create a value >= 0 for rating calculation;
        const temp = (((defense + intel + garrison) / level) * (currentHealth / maxHealth));

        switch(survivalRating) {
            case "Dying":
                this.score = (temp * 0.1).toFixed(1);
                break;
            case "Endangered":
                this.score = (temp * 0.7).toFixed(1);
                break;
            case "Desperate":
                this.score = (temp * 0.85).toFixed(1);
                break;
            case "Stable":
            case "Developing":
                this.score = (temp).toFixed(1);
                break;
            case "Blossoming":
                this.score = (temp * 1.1).toFixed(1);
                break;
            case "Flourishing":
                this.score = (temp * 1.2).toFixed(1);
                break;
            default:
                this.score = undefined;
                break;
        }
    }

    getScore() {
        return this.score;
    }

    setRating() {
        const value = this.score;

        if(value <= 0.5) {
            this.rating = "Dangerous";
        } else if(value > 0.5 && value < 1) {
            this.rating = "Lawless";
        } else if(value >= 1 && value < 2) {
            this.rating = "Unsafe";
        } else if(value >= 2 && value < 3) {
            this.rating = "Safe";
        } else if(value >=3 && value < 4) {
            this.rating = "Guarded";
        } else if(value >= 4 && value < 4.6) {
            this.rating = "Protected";
        } else if (value >= 4.6) {
            this.rating = "Impregnable";
        }
    }

    getRating() {
        return this.rating;
    }

    getUpkeep(level) {
        // intialize variables;
        let dice;
        let times;

        switch(this.rating) {
            case "Dangerous":
                dice = 0;
                times = 0;
                break;
            case "Lawless":
                dice = 4;
                times = 1;
                break;
            case "Unsafe":
                dice = 6;
                times = 1.5;
                break;
            case "Safe":
                dice = 8;
                times = 2;
                break;
            case "Guarded":
                dice = 8
                times = 3;
                break;
            case "Protected":
                dice = 10;
                times = 4;
                break;
            case "Impregnable":
                dice = 12;
                times = 5;
                break;
            default:
                dice = 0;
                times = 0;
        }

        const timesRolled = level * times;
        return diceRoll(dice, timesRolled);
    }

    costImpact(data) {
        // filters through object to match safety components
        // and bring them down with their respective values;
        const keys = Object.keys(data);
        const values = Object.values(data);
        for(let i = 0; i < keys.length; i += 1) {
            if(this.importFilter.indexOf(keys[i]) !== -1) {
                if(keys[i] === "safety bonus") {
                    this.bonusDown(values[i]);
                } else if(keys[i] === "defense") {
                    this.defenseCurrentDown(values[i]);
                } else if(keys[i] === "defense bonus") {
                    this.defenseBonusDown(values[i]);
                } else if(keys[i] === "intel") {
                    this.intelCurrentDown(values[i]);
                } else if(keys[i] === "intel bonus") {
                    this.intelBonusDown(values[i]);
                } else if(keys[i] === "garrison") {
                    this.garrisonCurrentDown(values[i]);
                } else if(keys[i] === "garrison bonus") {
                    this.garrisonBonusDown(values[i]);
                }
            }
        }
    }

    reward(data) {
        // filters through object to match safety components
        // and bring them up with their respective values;
        const keys = Object.keys(data);
        const values = Object.values(data);
        for(let i = 0; i < keys.length; i += 1) {
            if(this.importFilter.indexOf(keys[i]) !== -1) {
                if(keys[i] === "safety bonus") {
                    this.bonusUp(values[i]);
                } else if(keys[i] === "defense") {
                    this.defenseCurrentUp(values[i]);
                } else if(keys[i] === "defense bonus") {
                    this.defenseBonusUp(values[i]);
                } else if(keys[i] === "intel") {
                    this.intelCurrentUp(values[i]);
                } else if(keys[i] === "intel bonus") {
                    this.intelBonusUp(values[i]);
                } else if(keys[i] === "garrison") {
                    this.garrisonCurrentUp(values[i]);
                } else if(keys[i] === "garrison bonus") {
                    this.garrisonBonusUp(values[i]);
                }
            }
        }
    }
}