# Categories System Summary

## Overview

Categories serve as thematic wrappers for Attributes, organizing them into logical groups and adding mechanical and narrative depth. They provide aggregate Scores, Ratings, and Bonuses, and establish dependencies that create cascading effects throughout the settlement.

---

## Core Features

### 1. **Thematic Grouping**

- Categories group related Attributes to streamline organization and provide clarity.
- **Default Categories and Attributes:**
  - **Survival**:
    - Attributes: Food, Shelter, Medical Capacity.
  - **Safety**:
    - Attributes: Defensive Infrastructure, TBD Attribute 1, TBD Attribute 2.
  - **Economy**:
    - Attributes: Culture, Trade, Craftsmanship.

### 2. **Special Attributes**

- Certain mechanics-focused elements are not part of Categories due to their specific functions:
  - **Examples**: Supplies, Labor Pool, Intelligence, Garrison.

### 3. **Aggregate Scores and Ratings**

- Categories calculate:
  - **Score**: A numerical value representing the state of the Category.
  - **Rating**: A qualitative label (e.g., “Excellent,” “Poor”) for at-a-glance understanding.
- **Example:**
  - Survival Score: 75 → Rating: “Good.”
  - Safety Score: 40 → Rating: “Poor.”

### 4. **Category Bonuses**

- Each Category can grant a Bonus that applies to all its Attributes.
- **Example:**
  - Economy Bonus: +1 modifier to Culture, Trade, and Craftsmanship.

---

## Dependency System

### 1. **Core Concept**

- Categories have **dependencies**, meaning one Category’s state directly influences another.
- **Default Dependency Tree:**
  - **Survival** → **Safety** → **Economy**
    - Survival impacts Safety.
    - Safety impacts Economy.

### 2. **Mechanics**

- Dependencies create **multiplicative effects** based on thresholds:
  - Example:
    - Survival < 29% applies a 30% penalty to Safety.
    - Safety at 50% applies a 15% penalty to Economy.
- Positive Scores boost dependent Categories:
  - Example:
    - Survival > 80% applies a +10% boost to Safety.

### 3. **Thresholds**

- Dependencies activate at defined percentage ranges:
  - **Below 29%**: Severe penalty (e.g., -30%).
  - **30–59%**: Moderate penalty (e.g., -15%).
  - **60–79%**: Neutral.
  - **80%+**: Positive boost (e.g., +10%).

---

## Role in the System

### 1. **Narrative and Mechanical Impact**

- Categories provide context and mechanical feedback for settlement management:
  - Poor Survival cascades into weaker Safety and a struggling Economy.
  - Strong Economy might improve Trade or unlock prosperity-related events.

### 2. **Dynamic Feedback**

- Categories dynamically adjust based on Attribute changes, weather, events, and dependencies:
  - Example: A famine reduces Food (Survival), triggering cascading penalties to Safety and Economy.

### 3. **Player and DM Interaction**

- Categories are a core reference for DMs and players, offering insight into the settlement’s overall state:
  - Example: A DM sees “Survival: Poor” and triggers famine-related events.
  - Players might undertake actions to bolster Safety, stabilizing other dependent Categories.

---

## UI and Visualization

### 1. **Category Dashboard**

- Categories are displayed with:
  - Score and Rating (e.g., “Safety: 42 (Poor)”).
  - Dependency impacts (e.g., “-30% from Survival”).
  - Bonus effects applied to Attributes.

### 2. **Dependency Visualization**

- Show dependencies as a flowchart or tree diagram:
- [Survival] -> [Safety] -> [Economy]

### 3. **Dynamic Feedback**

- Provide clear summaries of cascading impacts:
- Example:
  ```
  Safety Score: 42 (Base: 60, -30% from Survival)
  Economy Score: 36 (Base: 42, -15% from Safety)
  ```

---

## Advanced Features

### 1. **Event Interaction**

- Categories could influence event weighting:
- Low Survival increases weight for `scarcity` or `famine` events.
- High Safety reduces weight for `rebellion` or `bandit` events.

### 2. **Cascading Impacts**

- Extreme values in a Category could trigger unique events:
- Example: Survival < 20% → “Starvation Riots.”

### 3. **Customization**

- Allow DMs to:
- Modify the dependency tree.
- Adjust threshold values or penalty/bonus percentages.
- Create custom Categories (e.g., “Arcane Balance”).

---

## Design Philosophy

### 1. **Abstract yet Meaningful**

- Categories simplify complex mechanics into clear, thematic groupings.

### 2. **Narrative-First**

- Dependencies and cascading effects enhance storytelling, making the settlement feel alive and interconnected.

### 3. **Dynamic and Scalable**

- Categories adapt to changes in Attributes and world state, ensuring they remain relevant throughout gameplay.

---

## Future Considerations

1. **Customizable Dependency Trees**:

- Allow DMs to create unique hierarchies for their campaigns.

2. **Player-Facing Metrics**:

- Let players interact with or target Categories directly through actions.

3. **Event-Based Bonuses or Penalties**:

- Introduce events that temporarily modify Category dependencies (e.g., “Bolster Safety” reduces penalties from Survival).

---
