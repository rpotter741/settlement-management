# Attributes System Summary

## Overview

Attributes are the core metrics that represent the state of a settlement. They influence Listener activation, event recommendations, and world dynamics, serving as a bridge between narrative depth and mechanical systems.

---

## Core Concepts

### 1. **Purpose of Attributes**

- Represent key aspects of a settlement, such as resources, morale, and security.
- Directly influence:
  - Listener activation (e.g., low food activates famine-related events).
  - Event impacts (e.g., morale drops after a rebellion).
  - Tag weights (e.g., low food increases `scarcity` tag weight).

### 2. **Default Attributes**

Commonly tracked attributes include:

- **Food**: Measures availability of sustenance for the population.
- **Morale**: Represents the overall happiness and confidence of the settlement.
- **Security**: Indicates the ability to defend against threats and maintain order.
- **Medical Capacity**: Tracks the settlement’s ability to handle disease or injuries.
- **Trade Capacity**: Reflects access to external resources and trade routes.
- **Population**: Tracks the number of residents, influencing other attributes.

---

## Mechanics

### 1. **Initialization**

- Attributes start at a base value (default: `1`).
- Biome, settlement type, and other narrative details can influence initial attribute values.
  - Example: A desert biome might start with low food and high trade capacity.

### 2. **Interplay with Tags**

- Attribute levels dynamically affect tag weights, which influence event recommendations:
  - **Low Food** → Increased weight for `scarcity` or `famine` tags.
  - **High Security** → Decreased weight for `rebellion` or `bandit` tags.
- Tags allow a single attribute to impact multiple event types:
  - Example: Low morale might increase weights for both `rebellion` and `disease` events.

### 3. **Dynamic Adjustments**

- Attributes are influenced by events, weather systems, and player actions.
  - Example: A wildfire event might reduce food and morale.
- Attribute changes cascade into future Listener activity, creating a feedback loop.

---

## Tracking and Customization

### 1. **UI Presentation**

- Attributes are displayed prominently on the DM dashboard with:
  - Current value (e.g., “Food: 30”).
  - Status indicators (e.g., “Stable,” “Declining”).
  - Event impacts (e.g., “-2 Food after Wildfire”).

### 2. **Customization**

- DMs can:
  - Add new attributes to reflect unique campaign needs (e.g., "Magic Reserves").
  - Modify how attributes interact with tags and events.
- Example of a Custom Attribute:
  - **Name:** “Faith.”
  - **Tags Influenced:** `religious`, `arcane`.

---

## Interactions with Other Systems

### 1. **Listeners**

- Listeners evaluate attribute thresholds to recommend events.
  - Example: The Angry Mob Listener activates if Security < 60%.

### 2. **Event Impacts**

- Events directly modify attributes based on their narrative context.
  - Example: “Famine” event reduces Food by 5 and Morale by 2.
- Attribute-based impacts vary by severity:
  - Trivial: Small, localized impact.
  - Moderate: Settlement-wide consequences.
  - Pivotal: Long-term or catastrophic changes.

### 3. **Tags and Event Weights**

- Attributes indirectly influence which events are recommended:
  - Low attributes increase the weight of related event tags.
  - Example: Low Medical Capacity increases weight for `plague` or `disease` events.

---

## Advanced Features

### 1. **Weather Interactions**

- Attributes are affected by weather systems, which track ongoing conditions.
  - Example: A drought reduces Food and increases the weight of `scarcity` tags.

### 2. **Buildings and Upgrades**

- Certain buildings can modify attribute behavior.
  - Example: A Granary increases Food resilience during shortages.

### 3. **Abstract Progress Trackers (APTs)**

- Attributes can trigger or influence APT thresholds.
  - Example: Low Morale advances a Rebellion Tracker.

---

## Narrative Integration

### 1. **Narrative Context**

- Attributes often frame the narrative stakes of events:
  - Example: “With food supplies dwindling, the people grow restless.”

### 2. **Dynamic Scaling**

- Attributes adjust event severity to match the settlement’s scale.
  - Example: A riot in a large city (Population > 5000) causes greater Security penalties than in a small village.

---

## Attribute-Related Settings

### 1. **Default Values**

- DMs can define baseline attribute values during settlement creation.
  - Example: Starting Food at 20 for a fertile biome.

### 2. **Thresholds**

- Customize thresholds for Listener activation or attribute impacts:
  - Example: Activate Angry Mob Listener at Security < 40% instead of 60%.

### 3. **Adjustable Scaling**

- DMs can set how strongly attributes influence tag weights or event severity.
  - Example: Increase the weight multiplier for Low Food from 1.5x to 2x.

---

## Design Philosophy

- **Abstract yet Flexible**: Attributes are broad enough to fit any campaign but customizable for unique needs.
- **Narrative-First**: Attribute changes always tie back to the story, enhancing immersion.
- **Dynamic and Interactive**: Attributes evolve based on events, creating a living, responsive world.

---

## Future Considerations

1. **Attribute Decay**:
   - Implement natural decay (e.g., Morale declines over time if unmet needs persist).
2. **Attribute-Specific Events**:
   - Introduce event packs tied to specific attributes (e.g., “Morale Crises” for low Morale).
3. **Player-Facing Metrics**:
   - Allow players to see or influence certain attributes through their actions.
