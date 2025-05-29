export default class EventLog {
  constructor() {
    this.activeEvents = []; // List of active events
    this.severityMap = {
      low: 0.5,
      moderate: 1,
      high: 1.5,
      extreme: 2,
    };
  }

  // Add a new event to the log
  addEvent(event) {
    this.activeEvents.push(event);
  }

  // Remove an event from the log by ID
  removeEvent(eventId) {
    this.activeEvents = this.activeEvents.filter(
      (event) => event.id !== eventId
    );
  }

  // Find an event by ID
  getEvent(eventId) {
    return this.activeEvents.find((event) => event.id === eventId) || null;
  }

  // Get events filtered by type
  getEvents({ type = 'all', eventType = null } = {}) {
    return this.activeEvents.filter((event) => {
      if (type === 'scheduled' && !event.scheduled) return false;
      if (type === 'active' && event.scheduled) return false;
      if (eventType && event.type !== eventType) return false;
      return true;
    });
  }

  sortEvents(events, sortBy = null) {
    if (!sortBy) return events; // Return unsorted if no key provided

    return [...events].sort((a, b) => {
      if (sortBy === 'startDate') {
        return new Date(a.startDate) - new Date(b.startDate);
      }
      if (sortBy === 'timeInDays') {
        return a.timeInDays - b.timeInDays;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      console.warn(`Unknown sort key: ${sortBy}`);
      return 0;
    });
  }

  // Decrement time for all events with a duration
  decrementEventTimes() {
    this.activeEvents.forEach((event) => event.progressTime());
    // Optionally remove expired events
    this.activeEvents = this.activeEvents.filter((event) => !event.isExpired());
  }

  clampImpact(value, min = -50, max = 50) {
    return Math.max(min, Math.min(max, value));
  }

  getSeverityMultiplier(severity) {
    return this.severityMap[severity] || 1; // Default to Moderate
  }

  calculateEventImpact(event, settlement, impact) {
    const { category, baseAmount, scaling, immutable } = impact;

    if (immutable) return baseAmount;

    let severityMultiplier = this.getSeverityMultiplier(event.severity);

    let dependencyModifier = 1;
    if (scaling.self) {
      const selfScore = settlement.categories[category]?.score || 0;
      dependencyModifier *= Math.pow((11 - selfScore) / 10, 2);
    }
    if (scaling.dependent) {
      const dependencies = settlement.categories[category].dependencies || [];
      const dependencyScores = dependencies.map(
        (dep) => settlement.categories[dep.target]?.score || 0
      );
      const averageScore =
        dependencyScores.reduce((sum, score) => sum + score, 0) /
        (dependencyScores.length || 1);
      dependencyModifier *= Math.pow((11 - averageScore) / 10, 2);
    }

    dependencyModifier = Math.min(Math.max(dependencyModifier, 0.5), 3);

    return Math.round(baseAmount * severityMultiplier * dependencyModifier);
  }

  randomizeSeverity = () => {
    const weights = { low: 0.4, moderate: 0.35, high: 0.2, extreme: 0.05 };
    const random = Math.random();
    let cumulative = 0;

    for (const [key, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) return key;
    }
    return 'moderate'; // Fallback
  };
}
