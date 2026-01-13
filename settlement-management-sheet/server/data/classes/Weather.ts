export default class Weather {
  constructor(type, effects, customIntegrations = [], step = 0, maxStep = 5) {
    this.type = type;
    this.effects = effects;
    this.customIntegrations = customIntegrations;
    this.step = step;
    this.maxStep = maxStep;
  }

  calculateEffects() {
    return this.effects.map((effect) => ({
      ...effect,
      value: effect.value * this.step,
    }));
  }

  adjustStep(value) {
    this.step = Math.min(Math.max(this.step + value, 0), this.maxStep);
  }

  resetStep() {
    this.step = 0;
  }

  addCustomIntegration(integration) {
    this.customIntegrations.push(integration);
  }

  removeCustomIntegration(integration) {
    this.customIntegrations = this.customIntegrations.filter(
      (i) => i !== integration
    );
  }
}
