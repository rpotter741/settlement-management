export default class EventLog {
  constructor() {
    this.activeEvents = []; // List of active events
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
  getEventsByType(type) {
    return this.activeEvents.filter((event) => event.type === type);
  }

  // Decrement time for all events with a duration
  decrementEventTimes() {
    this.activeEvents.forEach((event) => event.decrementTime());
    // Optionally remove expired events
    this.activeEvents = this.activeEvents.filter((event) => !event.isExpired());
  }
}
