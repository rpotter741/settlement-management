# Trade Hubs in Eclorean Ledger

## Overview

Trade Hubs are dynamic entities that facilitate the buying and selling of resources between settlements. They introduce strategic opportunities and narrative depth by responding to resource **availability**, **settlement demand**, and player actions. Trade Hubs scale with their **level**, allowing them to grow alongside the settlement and provide increasingly impactful interactions.

---

## Core Features

### **1. Resource Availability**

Trade Hubs categorize resources into availability states:

- **Scarce**: Limited supply, higher prices (+50%).
- **Normal**: Balanced supply and demand, baseline prices.
- **Abundant**: Excess supply, lower prices (-25%).

Availability impacts:

- **Pricing**: Availability modifiers adjust base prices.
- **Narrative**: Scarcity or abundance can influence events and player strategies.

### **2. Trade Hub Levels**

Trade Hubs have levels that determine the scale of their operations:

- **Resource Scaling**: Availability categories adjust with hub level.
  - Example:
    - Scarce Food at Level 2: 10 units.
    - Scarce Food at Level 10: 50 units.
- **Growth Mechanics**:
  - Hubs can grow through player actions, events, or sustained trade activity.
  - Higher levels unlock more diverse resources, stabilize prices, and attract unique events.

### **3. Dynamic Pricing System**

Pricing adjusts based on:

- **Base Price**: Calculated as `35 × Settlement Level` for Food (example value).
- **Availability Modifier**:
  - Scarce: +50%.
  - Normal: Baseline.
  - Abundant: -25%.
- **Demand Modifier**:
  - Inversely proportional to the settlement’s attribute value.
  - Formula: `Demand Modifier = 100% - (Current Value / Max Value × 100%)`.
  - Example:
    - Current Food: 30% of max.
    - Demand Modifier: +70%.
- **Final Price**:
  - `Base Price × (1 + Availability Modifier) × (1 + Demand Modifier)`.

Example Calculation:

- Settlement Level: 3.
- Base Price: `35 × 3 = 105`.
- Availability: Scarce (+50%).
- Demand: Food at 30% of max (+70%).
- Final Price: `105 × 1.5 × 1.7 = 267.75` gold.

### **4. Trends and Variance**

- **Trends**: Gradual adjustments to resource availability over time (e.g., Food trending from Abundant to Scarce).
- **Variance**: Adds randomness to availability and pricing for dynamism.
  - Example: Normal variance of ±10% keeps prices unpredictable.

### **5. Player Interaction**

Players can influence Trade Hubs through:

- **Events**: Resolve trade hub crises (e.g., repair a damaged hub) or take advantage of opportunities.
- **Actions**: Invest in hubs to increase levels, secure alliances, or stabilize prices.
- **Advanced Trade Rules** (optional): Introduces travel time and risk:
  - Resources and gold take time to move between the settlement and the hub.
  - Events like ambushes or delays add risk to trade routes.

### **6. Global and Local Effects**

- **Global Modifiers**: Average availability across all connected hubs adjusts global trends:
  - Example: A baseline of 3 Normals and 1 Abundant creates neutral pricing. Changing to 2 Scarce and 2 Normal adds a +33% global price increase.
- **Localized Impact**: Individual hubs reflect their specific availability and relationship modifiers.

---

## Narrative Role

### **1. Reactive Storytelling**

- **Localized Events**: Trade Hubs respond to regional or global events:
  - Example: A famine reduces Food availability at nearby hubs, spiking prices.
  - Example: A storm damages a hub, reducing its level and limiting available resources.

### **2. Player Agency**

- Players shape the trade economy by:
  - Building alliances for better prices.
  - Stabilizing hub levels through investment or aid.
  - Managing crises to protect key resources.

### **3. Strategic Decision-Making**

- Balancing priorities becomes critical:
  - Should the settlement spend gold to secure Food during a scarcity event?
  - Is it worth investing in a distant hub to increase its level, knowing it takes longer to access?

---

## UI/UX Considerations

### **1. Trade Hub Overview**

- **Display Key Data**:
  - Hub Level.
  - Resource Availability (Scarce, Normal, Abundant).
  - Prices with modifiers (availability, demand).
- **Visual Indicators**:
  - Trends (e.g., arrows showing increasing or decreasing availability).
  - Relationship status (e.g., Friendly, Neutral, Hostile).

### **2. Player Interaction**

- **Actions Panel**:
  - Options to invest in hub levels, negotiate alliances, or resolve crises.
- **Trade Routes (Advanced Trade)**:
  - Interface showing travel times and risks for resources in transit.

---

## Summary

Trade Hubs in Eclorean Ledger:

1. Create dynamic pricing based on **availability** and **settlement demand**.
2. Scale resource availability with **hub levels**, providing meaningful progression.
3. Tie into **narrative events**, driving emergent stories and player decision-making.
4. Encourage **strategic gameplay**, balancing short-term needs against long-term stability.

This system ensures that the trade economy remains engaging, impactful, and deeply tied to the evolving story of the settlement.
