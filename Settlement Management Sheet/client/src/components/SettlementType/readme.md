# Settlement Types in Eclorean Ledger

## Overview

Settlement Types define the core identity and mechanical focus of a settlement, influencing its upgrades, buildings, events, and narrative trajectory. Chosen at **Level 4** (customizable), Settlement Types serve as thematic and mechanical wrappers for favored Categories, offering unique bonuses, trade-offs, and opportunities for strategic storytelling.

---

## Core Features

### **1. Favored and Penalized Categories**

- **Favored Categories**:
  - Settlement Types provide bonuses to one or more Categories, enhancing related attributes and actions.
  - Example:
    - **Fortified**: Favored Category - Safety.
    - Bonus: +10% to Safety-related attributes (e.g., Garrison, Defensive Infrastructure).
- **Penalized Categories**:
  - To maintain balance, Settlement Types apply penalties to certain Categories.
  - Example:
    - **Fortified**: Penalized Category - Survival.
    - Penalty: -5% to Survival-related attributes (e.g., Food, Shelter).

### **2. Upgrade Trees**

- Settlement Types determine which upgrades are available at **even levels** (Levels 4, 6, 8, etc.).
- **Predefined Trees**:
  - Each Settlement Type comes with a default upgrade tree that aligns with its theme.
  - Example:
    - **Fortified**:
      - Level 4: "Militia Barracks" (+1 Garrison, unlock Guard Tower building).
      - Level 6: "Strategic Command" (+1 Intelligence, unlock Wall Reinforcement upgrade).
    - **Mercantile**:
      - Level 4: "Trade Hub Establishment" (+1 Trade, unlock Marketplace building).
      - Level 6: "Merchant's Guild" (-10% Trade event costs, unlock Luxury Shops).

### **3. Optional Building Packs**

- Settlement Types can include **thematic building packs**, which are **optional** and fully editable by the DM.
  - Example:
    - **Fortified**:
      - Default buildings: Guard Towers, Walls, Barracks.
    - **Mercantile**:
      - Default buildings: Marketplaces, Warehouses, Trade Hubs.
- **Customization**:
  - DMs can toggle building packs on or off or add new packs to fit the campaign’s needs.

### **4. Hook-Out Integration**

- Settlement Types expose thematic **Hook-Outs** that interact with listeners and events:
  - **Persistent Hook-Outs**:
    - Each Settlement Type has a core Hook-Out that remains exposed throughout the game.
    - Example:
      - **Fortified**: `fortificationFocus` (drives defense-related events).
      - **Mercantile**: `economicAmbitions` (drives trade and diplomacy events).
  - **Dynamic Hook-Outs**:
    - Temporary hooks toggle on or off randomly each turn, adding variety to event generation.
    - Example:
      - Fortified alternates between `siegePreparedness`, `borderDisputes`, and `infrastructureStress`.
  - **Scaling Hook-Outs**:
    - Hook-Outs evolve as the settlement levels up, introducing more complex or impactful events.
    - Example:
      - Early levels: `fortificationFocus` triggers minor skirmish events.
      - Later levels: Activates `siegePreparedness`, escalating to full-scale siege narratives.

### **5. Trade-Offs**

- Settlement Types balance their benefits with meaningful penalties to ensure strategic decision-making.
  - Example:
    - **Fortified**:
      - Bonus: +10% to Safety attributes.
      - Penalty: -5% to Survival attributes, +10% to Settlement Point cost for Survival upgrades.
    - **Mercantile**:
      - Bonus: Increased Trade event frequency.
      - Penalty: Decreased Safety event mitigation.

---

## Integration with Other Systems

### **1. Events and Listeners**

- Settlement Types interact seamlessly with events and listeners:
  - Persistent and dynamic Hook-Outs drive thematic event chains.
  - Listener packs scale challenges based on settlement growth.
  - Example:
    - A Fortified Settlement’s `siegePreparedness` Hook-Out triggers siege-related event packs.

### **2. Player Actions**

- Certain Settlement Types unlock unique **player actions**:
  - Example:
    - **Mercantile**: "Negotiate Tariffs" (reduce Trade event costs for 3 turns).
    - **Survivalist**: "Forage" (convert Labor Pool into Food).

### **3. Strategic Narrative Impact**

- Settlement Types create emergent narratives by shaping:
  - Upgrade choices.
  - Thematic buildings and actions.
  - Event pools and listener activation.

---

## UI/UX Considerations

### **1. Selection Process**

- Present players with clear options at Level 4:
  - Include descriptions, favored/penalized Categories, and thematic bonuses/penalties.
- Visual indicators for trade-offs:
  - Green for bonuses, red for penalties.

### **2. Dynamic Hook-Out Display**

- Show currently exposed Hook-Outs on the dashboard:
  - Persistent hooks in one section.
  - Temporary hooks with timers or toggle indicators.

### **3. Customization Options**

- Allow DMs to:
  - Adjust favored/penalized Categories.
  - Edit or replace building packs.
  - Modify or add Hook-Outs.

---

## Narrative Role

### **1. Long-Term Identity**

- Settlement Types define the settlement’s role in the campaign world:
  - A Fortified Settlement becomes a bastion of defense.
  - A Mercantile Settlement thrives on trade and diplomacy.

### **2. Replayability**

- Unique Settlement Types offer varied gameplay experiences across campaigns:
  - Each type emphasizes different mechanics and narrative themes.

### **3. Emergent Storytelling**

- Persistent and dynamic Hook-Outs ensure Settlement Types influence the narrative from start to finish:
  - Example: A Fortified Settlement faces recurring sieges, reinforcing its identity and testing the players’ resolve.

---

## Summary

Settlement Types in Eclorean Ledger:

1. Define the settlement’s identity through **favored and penalized Categories**.
2. Unlock **unique upgrades, buildings, and player actions** tied to thematic focus.
3. Introduce **dynamic Hook-Outs** that drive emergent storytelling and event generation.
4. Balance strategic bonuses with meaningful trade-offs, encouraging thoughtful decision-making.
5. Ensure replayability and customization, adapting to any campaign style or narrative.

This system provides a rich foundation for settlements to grow in ways that feel impactful, thematic, and deeply tied to the players’ choices.
