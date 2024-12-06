export default class Event {
  constructor({
    id,
    name,
    type,
    timeInDays,
    laborNeeded,
    cost,
    impact,
    reward,
    details,
  }) {
    this.id = id || `event-${Date.now()}`; // Unique ID
    this.name = name; // Event name
    this.type = type; // Immediate, Active, Passive, Indefinite
    this.timeInDays = timeInDays || null; // Duration (null for indefinite)
    this.laborNeeded = laborNeeded || 0;
    this.laborProgress = 0;
    this.cost = cost || []; // Resource costs
    this.impact = impact || []; // Immediate/ongoing effects
    this.reward = reward || []; // Rewards upon resolution
    this.details = details || ''; // Optional description
    this.workers = 0; // Number of workers assigned to the event
    this.hide = false; // Display status
    this.link = null; // Optional linked event
  }

  progressTime(turnDurationInDays) {
    if (this.timeInDays !== null) {
      this.timeInDays -= turnDurationInDays;
    }
  }

  allocateLabor() {
    this.laborProgress += this.workers;
  }

  isExpired() {
    return (
      (this.time !== null && this.time <= 0) ||
      this.laborProgress >= this.laborNeeded
    );
  }
}
