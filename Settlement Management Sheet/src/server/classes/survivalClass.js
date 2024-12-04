export default class Survival {

    constructor() {
        this.bonus = 0;
        this.foodCurrent = 0;
        this.foodBonus = 0;
        this.foodMax = 0;
        this.suppliesCurrent = 0;
        this.suppliesBonus = 0;
        this.suppliesMax = 0;
        this.medicalCurrent = 0;
        this.medicalBonus = 0;
        this.medicalMax = 0;
        this.rating = undefined;
        this.score = undefined;
        this.importFilter = [
            "survival bonus",
            "food",
            "food bonus",
            "supplies",
            "supplies bonus",
            "medical",
            "medical bonus",
        ]
    }

    setFoodCurrent(value) {
        this.foodCurrent = value;
    }

    foodCurrentUp(value) {
        this.foodCurrent += value;
    }

    foodCurrentDown(value) {
        this.foodCurrent -= value;
    }

    setFoodBonus(value) {
        this.foodBonus = value;
    }

    foodBonusUp(value) {
        this.foodBonus += value;
        this.foodCurrentUp(value);
    }

    foodBonusDown(value) {
        this.foodBonus -= value;
        this.foodBonusDown(value);
    }

    setFoodMax(level) {
        this.foodMax = (level * 5) + this.foodBonus + this.bonus
    }

    setSuppliesCurrent(value) {
        this.suppliesCurrent = value;
    }

    suppliesCurrentUp(value) {
        this.suppliesCurrent += value;
    }

    suppliesCurrentDown(value) {
        this.suppliesCurrent -= value;
    }

    setSuppliesBonus(value) {
        this.suppliesBonus = value;
    }

    suppliesBonusUp(value) {
        this.suppliesBonus += value;
        this.suppliesCurrentUp(value)
    }

    suppliesBonusDown(value) {
        this.suppliesBonus -= value;
        this.suppliesCurrentDown(value);
    }

    setSuppliesMax(level) {
        this.suppliesMax = (level * 3) + this.suppliesBonus + this.bonus;
    }

    setMedicalCurrent(value) {
        this.medicalCurrent = value;
    }

    medicalCurrentUp(value) {
        this.medicalCurrent += value;
    }

    medicalCurrentDown(value) {
        this.medicalCurrent -= value;
    }

    setMedicalBonus(value) {
        this.medicalBonus = value;
    }

    medicalBonusUp(value) {
        this.medicalBonus += value;
        this.medicalCurrentUp(value);
    }

    medicalBonusDown(value) {
        this.medicalBonus -= value;
        this.medicalCurrentDown(value);
    }

    setMedicalMax(level) {
        this.medicalMax = (level * 2) + this.medicalBonus + this.bonus;
    }

    setBonus(value) {
        this.bonus = value;
    }

    bonusUp(value) {
        this.bonus += value;
        this.foodCurrentUp(value);
        this.suppliesCurrentUp(value);
        this.medicalCurrentUp(value);
    }

    bonusDown(value) {
        this.bonus -= value;
        this.foodCurrentDown(value)
        this.suppliesCurrentDown(value);
        this.medicalCurrentDown(value);
    }

    setMax(level) {
        this.setFoodMax(level);
        this.setSuppliesMax(level);
        this.setMedicalMax(level);
    }

    setScore(level, currentHealth, maxHealth) {
        this.setMax(level);

        // initialize variables for holding values;
        let food;
        let supplies;
        let medical;

        // Use Max Food if current is higher;
        if(this.foodCurrent > this.foodMax) {
            food = this.foodMax;
        } else {
            food = this.foodCurrent;
        }

        // Use Max Supplies if current is higher;
        if(this.suppliesCurrent > this.suppliesMax) {
            supplies = this.suppliesMax;
        } else {
            supplies = this.suppliesCurrent;
        }

        // Use Max Medical if current is higher;
        if(this.medicalCurrent > this.medicalMax) {
            medical = this.medicalMax;
        } else {
            medical = this.medicalCurrent;
        }

        // create a value >= 0 for rating calculation;
        this.score = (((food + supplies + medical) / level) * (currentHealth / maxHealth)).toFixed(1);
    }

    getScore() {
        return this.score;
    }

    setRating() {
        const value = this.score;

        if(value <= 1) {
            this.rating = "Dying";
        } else if(value > 1 && value <= 3.9) {
            this.rating = "Endangered";
        } else if(value >= 4 && value <= 4.9) {
            this.rating = "Desperate";
        } else if(value >= 5 && value <= 6.9) {
            this.rating = "Stable";
        } else if(value >= 7 && value <= 7.9) {
            this.rating = "Developing";
        } else if(value >= 8 && value <= 9.4) {
            this.rating = "Blossoming";
        } else if(value > 9.4) {
            this.rating = "Flourishing";
        }
    }

    getRating() {
        return this.rating;
    }

    costImpact(data) {
        // filters through object to match survival components
        // and bring them down with their respective values;
        const keys = Object.keys(data);
        const values = Object.values(data);
        for(let i = 0; i< keys.length; i += 1) {
            if(this.importFilter.indexOf(keys[i]) !== -1) {
                if(keys[i] === "survival bonus") {
                    this.bonusDown(values[i]);
                } else if(keys[i] === "food") {
                    this.foodCurrentDown(values[i]);
                } else if(keys[i] === "food bonus") {
                    this.foodBonusDown(values[i]);
                } else if(keys[i] === "supplies") {
                    this.suppliesCurrentDown(values[i]);
                } else if(keys[i] === "supplies bonus") {
                    this.suppliesBonusDown(values[i]);
                } else if(keys[i] === "medical") {
                    this.medicalCurrentDown(values[i]);
                } else if(keys[i] === "medical bonus") {
                    this.medicalBonusDown(values[i]);
                }
            }
        }
    }

    reward(data) {
        // filters through object to match survival components
        // and bring them up with their respective values;
        const keys = Object.keys(data);
        const values = Object.values(data);
        for(let i = 0; i < keys.length; i +=1) {
            if(this.importFilter.indexOf(keys[i]) !== -1) {
                if(keys[i] === "survival bonus") {
                    this.bonusUp(values[i]);
                } else if(keys[i] === "food") {
                    this.foodCurrentUp(values[i]);
                } else if(keys[i] === "food bonus") {
                    this.foodBonusUp(values[i]);
                } else if(keys[i] === "supplies") {
                    this.suppliesCurrentUp(values[i]);
                } else if(keys[i] === "supplies bonus") {
                    this.suppliesBonusUp(values[i]);
                } else if(keys[i] === "medical") {
                    this.medicalCurrentUp(values[i]);
                } else if(keys[i] === "medical bonus") {
                    this.medicalBonusUp(values[i]);
                }
            }
        }
    }
}