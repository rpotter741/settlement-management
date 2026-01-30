export default class StatusRecommender {
  constructor(statuses, settlement) {
    this.statuses = statuses;
    this.settlement = settlement;
    this.previousRecommendations = [];
  }

  recommendStatuses() {
    return this.statuses.filter((status) =>
      status.conditions.every(({ category, operator, value }) => {
        const score = this.settlement.categories[category]?.score || 0;
        switch (operator) {
          case 'lt':
            return score < value;
          case 'lte':
            return score <= value;
          case 'gt':
            return score > value;
          case 'gte':
            return score >= value;
          case 'eq':
            return score === value;
          default:
            return false;
        }
      })
    );
  }

  avoidRepetition(recommendedStatuses) {
    return recommendedStatuses.filter(
      (status) => !this.previousRecommendations.includes(status.name)
    );
  }

  updateHistory(recommendedStatuses) {
    this.previousRecommendations.push(
      ...recommendedStatuses.map((s) => s.name)
    );
    if (this.previousRecommendations.length > 10) {
      this.previousRecommendations.splice(
        0,
        this.previousRecommendations.length - 10
      );
    }
  }
}
