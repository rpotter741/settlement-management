# Upgrades in Eclorean Ledger

## Overview

Upgrades are pivotal progression tools in Eclorean Ledger, defining a settlement's growth and identity. Tied to **Settlement Types** and **Leadership Styles**, they offer players strategic choices and influence the settlement’s mechanics, actions, and narrative integration. Many upgrades also include **trade-offs**, ensuring that each choice carries both benefits and consequences, reinforcing the settlement’s thematic focus.

---

## Core Concepts

### **1. Settlement Type Upgrades**

- **What They Are**: Define the settlement’s role in the world (e.g., Mercantile, Fortified, Survivalist).
- **Purpose**: Unlock unique buildings, actions, and bonuses that shape the settlement’s mechanical and narrative focus.
- **Example Paths**:
  - **Mercantile**:
    - **Level 1**: "Trade Hub Establishment"
      - Bonus: Increases Trade attribute bonus.
      - Unlocks: "Marketplaces" building.
    - **Level 2**: "Merchant's Guild"
      - Bonus: Reduces the cost of Trade-related events.
      - Unlocks: "Luxury Shops" building and "Negotiate Tariffs" action.
  - **Fortified**:
    - **Level 1**: "Militia Barracks"
      - Bonus: Reduces severity of **Attack** events.
      - Unlocks: "Guard Tower" building.
      - Trade-Off: Slightly reduces Labor Pool efficiency due to increased militarization.
    - **Level 2**: "Strategic Command"
      - Bonus: Intelligence attribute gains a bonus during **sieges**.
      - Unlocks: "Wall Reinforcement" upgrade and "Prepare Siege Defenses" action.
      - Trade-Off: Increases Supplies cost due to heightened military upkeep.
  - **Survivalist**:
    - **Level 1**: "Hunter's Lodge"
      - Bonus: Increases Food attribute during harsh weather.
      - Unlocks: "Hunting Grounds" building.
    - **Level 2**: "Resourceful Communities"
      - Bonus: Increases Labor Pool efficiency.
      - Unlocks: "Foraging Trails" building.
      - Trade-Off: Reduces Morale slightly due to the demanding lifestyle.

### **2. Leadership Style Upgrades**

- **What They Are**: Define how players manage resources, resolve crises, and adapt to challenges.
- **Purpose**: Provide unique actions and mechanical advantages reflecting the leadership philosophy.
- **Example Styles**:
  - **Adaptive Resources**:
    - Action: **Redistribute Costs**
      - Effect: Migrate up to 50% of an impact cost to another attribute while maintaining Settlement Point equivalence.
      - Example: Trade 3 Food for 1 Medical Capacity.
  - **Calculated Risks**:
    - Action: **Push Your Limits**
      - Effect: Take on an additional temporary penalty to one attribute to gain a double reward in another.
      - Example: Gain `+4 Food Bonus` at the cost of `-2 Safety for 3 turns.`
  - **Resilient Foundations**:
    - Action: **Stabilize**
      - Effect: Spend 2 Labor Pool to mitigate penalties affecting an attribute for the next 3 turns.
      - Example: Reduce event penalties to Food by 50% for the next 3 turns.
  - **Opportunistic Alliances**:
    - Action: **Request Aid**
      - Effect: Reduce an attribute penalty by half while exposing a Hook-Out (e.g., `allianceFavorOwed`).

---

## Progression

### **Settlement Levels Unlock Upgrades**

- Each settlement level offers a choice of **two or more upgrades**.
- Choices are **mutually exclusive** to emphasize replayability and strategic planning.

### **Upgrade Choices with Trade-Offs**

- Upgrades introduce mechanical bonuses, unique actions, and/or narrative effects.
- Many upgrades include trade-offs that reinforce thematic strengths and weaknesses:
  - **Fortified Example**:
    - Bonus: +1 Safety Category, reduces Settlement Point costs for Safety attributes.
    - Trade-Off: -1 Survival Category, increases Settlement Point costs for Survival attributes.
  - **Adaptive Resources Example**:
    - Action: Redistribute Costs.
    - Trade-Off: Risk of creating imbalances in settlement attributes that could lead to cascading issues.

---

## Integration with Other Systems

### **Hook-Outs and Listeners**

Upgrades expose Hook-Outs that integrate with listeners and events:

- **Example Hook-Outs**:
  - Completing "Hunter's Lodge" exposes `wildlifeMigration`, triggering events tied to ecological themes.
  - Upgrading to "Strategic Command" exposes `strategicExpansion`, prompting military-focused event chains.

### **Event and Player Action Ties**

- Upgrades unlock unique **player actions** or influence event probabilities.
- Example:
  - **Hunter's Lodge** unlocks the **Forage Action**:
    - Effect: `+5 Food, -1 Morale` (simulating scarcity-driven resource gathering).
  - **Marketplace** increases trade-related event frequency and severity.

---

## UI/UX Considerations

### **1. Upgrade Interface**

- **Selection View**:
  - Tabbed layout for Settlement Type and Leadership Style.
  - Preview of each upgrade’s effects, trade-offs, unlocked actions, and event impacts.
- **Choice Confirmation**:
  - Descriptions and visual indicators of trade-offs before finalizing decisions.

### **2. Visual Upgrade Tree**

- Node-based interface displaying:
  - Current upgrade path.
  - Locked and available upgrades.
- Example:
  ```
  Hunter's Lodge ➔ Resourceful Communities ➔ Ecological Harmony.
  ```

---

## Narrative Role

### **1. Player Agency**

- Upgrades emphasize **collaborative decision-making**:
  - Players vote or debate on which upgrades align with the settlement’s priorities.

### **2. Dynamic Storytelling**

- Upgrade choices influence NPC relationships and the broader world:
  - Example:
    - Constructing a **Marketplace** triggers envy among nearby settlements.
    - Upgrading to **Martial Law** creates tension among the populace.

### **3. Emergent Gameplay**

- Upgrades shape the settlement’s response to events and listeners:
  - Example:
    - A fortified settlement is better equipped to handle siege events but may struggle economically.
    - A mercantile settlement thrives in trade but risks vulnerability to raids.

---

## Summary

Upgrades in Eclorean Ledger:

1. Offer meaningful progression tied to **Settlement Types** and **Leadership Styles**.
2. Unlock **unique buildings, player actions, and bonuses** that shape the settlement’s identity.
3. Introduce **trade-offs** that ensure impactful choices with both benefits and consequences.
4. Seamlessly integrate with listeners, events, and the broader narrative.
5. Encourage **strategic decision-making** and **collaborative storytelling**.

This system ensures that settlements grow in ways that feel impactful, unique, and deeply tied to player agency.
