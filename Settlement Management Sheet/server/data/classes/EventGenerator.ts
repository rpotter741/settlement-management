export default class EventGenerator {
  constructor(eventTemplates) {
    this.eventTemplates = eventTemplates; // { type: [template1, template2], ... }
  }

  generateEvent(type, settlement) {
    const templates = this.eventTemplates[type];
    if (!templates || templates.length === 0) {
      console.warn(`No templates found for type "${type}".`);
      return null;
    }

    // Weighted random selection (optional)
    const selectedTemplate = this.weightedRandom(templates);

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

  weightedRandom(templates) {
    const totalWeight = templates.reduce((sum, t) => sum + t.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;

    for (const template of templates) {
      cumulative += template.weight;
      if (rand <= cumulative) return template;
    }
    return templates[0];
  }
}
