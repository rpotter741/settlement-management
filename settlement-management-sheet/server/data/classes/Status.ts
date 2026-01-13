export default class Status {
  constructor({
    name,
    description = '',
    effects = [],
    step = 0,
    maxStep = 5,
    tags = [],
    conditions = [],
  }) {
    this.name = name; // Name of the status (e.g., "Fearful", "Inspired")
    this.description = description; // Optional description for context
    this.effects = effects; // Array of effects this status has on the settlement
    this.step = step; // Current severity level
    this.maxStep = maxStep; // Maximum severity level
    this.tags = tags; // Array of tags for categorization and dynamic triggers
    this.conditions = conditions; // Array of conditions that must be met for the status to apply
  }

  // Apply scaling to the effects based on the current step
  calculateEffects() {
    return this.effects.map((effect) => ({
      ...effect,
      value: effect.value * this.step, // Scale value by step
    }));
  }

  // Adjust the step (severity) of the status
  adjustStep(value) {
    this.step = Math.min(Math.max(this.step + value, 0), this.maxStep);
  }

  // Reset the step (e.g., when the status resolves)
  resetStep() {
    this.step = 0;
  }

  // Add a new effect dynamically
  addEffect(effect) {
    this.effects.push(effect);
  }

  // Remove an effect by target
  removeEffect(target) {
    this.effects = this.effects.filter((effect) => effect.target !== target);
  }
}
