export default class EventGenerator {
  constructor(eventTemplates) {
    this.eventTemplates = eventTemplates; // { type: [template1, template2], ... }
  }

  generateEvent(type, settlement) {
    const subTypes = this.eventTemplates[type];
    if (!subTypes || subTypes.length === 0) {
      console.warn(`No subTypes found for type "${type}".`);
      return null;
    }

    // Weighted random selection (optional)
    const selectedTemplate = this.weightedRandom(subTypes);

    // Dynamic adjustments
    const impacts = selectedTemplate.impacts.map((impact) => ({
      ...impact,
      cost: {
        ...impact.cost,
        baseAmount: impact.cost.baseAmount * settlement.level,
        // baseAmount is the default event cost value
      },
    }));

    return new Event({
      ...selectedTemplate,
      impacts,
      difficulty: selectedTemplate.difficulty + settlement.moralePenalty,
    });
  }

  weightedRandom(subTypes) {
    const totalWeight = subTypes.reduce((sum, t) => sum + t.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;

    for (const template of subTypes) {
      cumulative += template.weight;
      if (rand <= cumulative) return template;
    }
    return subTypes[0];
  }
}
