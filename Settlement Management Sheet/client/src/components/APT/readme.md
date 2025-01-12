# Abstract Progress Trackers (APTs) in Eclorean Ledger

## Overview

Abstract Progress Trackers (APTs) represent intangible or complex concepts that require tracking beyond traditional numerical attributes. They are versatile tools designed to integrate seamlessly with narrative and mechanical systems, allowing for dynamic storytelling and emergent gameplay.

---

## Core Features

### **1. Themes and Flexibility**

- **Purpose**: APTs are used to track abstract concepts like:
  - Plague Spread
  - Rebellion Momentum
  - Army Arrival
  - Festival Preparations
- **Customization**: DMs define APT themes, context, and progression rules during setup.

### **2. Thresholds**

- **Static Thresholds**: Trigger events or milestones at fixed progress values.
  - Example: At 50% Plague Spread, initiate a "Citywide Quarantine" event.
- **Dynamic Thresholds**: Adjust based on settlement conditions or player actions.
  - Example: Rebellion Momentum increases faster when Morale drops below 30%.
- **Types of Thresholds**:
  - **One-Time**: Trigger a unique event or milestone.
  - **Recurring**: Continuously spawn minor events while active.

### **3. Progression Mechanics**

- APTs can progress linearly, exponentially, or variably:
  - **Linear Progression**: Predictable, steady growth.
  - **Exponential Progression**: Escalates as the situation worsens (e.g., Plague Spread doubling every turn).
  - **Variable Progression**: Includes randomness or player-driven changes.

### **4. Decay and Recovery**

- **Natural Decay**: APTs can regress over time without player intervention.
  - Example: Rebellion Momentum decays if Morale improves.
- **Event and Impact Modifiers**: Player actions or settlement conditions influence decay rates.
  - Example: High Medical Capacity slows Plague Spread.

### **5. Integration with Events and Listeners**

- **Event Triggers**: APT thresholds expose Hook-Outs to activate listeners and events.
  - Example: At 80% Rebellion Momentum, trigger "Leader of the Revolution."
- **Dynamic Listener Integration**: Listeners adjust APT progression based on settlement state.
  - Example: Low Food accelerates Rebellion Momentum.

---

## Sub-APTs

### **1. Nested Progress Tracking**

- Sub-APTs are smaller, focused trackers tied to a parent APT.
  - Example:
    - Parent APT: Rebellion Momentum.
    - Sub-APT: "Faction Leadership" (tracks internal power struggles).

### **2. Triggered Creation**

- Sub-APTs spawn when specific thresholds are met in the parent APT.
  - Example:
    - At 80% Plague Spread, create a Sub-APT: "Find the Cure."

### **3. Independent Progression**

- Sub-APTs progress independently while influencing their parent APT.
  - Example: Completing "Find the Cure" reduces Plague Spread by 20%.

### **4. Narrative Depth**

- Sub-APTs allow for more granular storytelling:
  - Example: A rebellion Sub-APT "Radical Splinter Faction" introduces internal conflicts within the uprising.

---

## DM Control

### **1. Visibility Options**

- **Hidden**: APTs act as behind-the-scenes tools for the DM.
- **Visible**: Players see the APT name and progress bar but not the events tied to it.
- **Partial Transparency**: Players receive thematic hints instead of precise progress (e.g., "The rebellion is growing louder").

### **2. Manual and Automated Control**

- **Manual Adjustment**: DMs can directly edit APT progression, thresholds, or decay rates at any time.
- **Automated Integration**: Listeners and events dynamically adjust APTs based on settlement state or player actions.

### **3. Kill Switches**

- APTs can temporarily halt progression to avoid narrative dissonance:
  - Example: When a major storyline triggers, the APT slows or pauses to let the arc resolve naturally.

---

## UI/UX Considerations

### **1. Visual Representation**

- Use clear and intuitive visuals:
  - Circular progress bars, segmented meters, or Blades in the Dark-style clocks.
  - Color-coded thresholds for clarity.

### **2. Dashboard Integration**

- APTs appear in the DM dashboard with:
  - Current progress and thresholds.
  - Active effects or triggered events.
  - Listener integration and Hook-Outs.

### **3. Sub-APT Display**

- Nested progress bars or linked clocks visually connect Sub-APTs to their parent APTs.

---

## Narrative Role

### **1. Emergent Storytelling**

- APTs drive dynamic narratives by exposing hooks and triggering thematic events.
  - Example: A Festival Preparations APT could escalate from logistical hiccups to a grand success or catastrophic failure.

### **2. Strategic Depth**

- Players and DMs alike can influence APT progression through actions and decisions, creating high-stakes moments.

### **3. Replayability**

- Thematic variety and dynamic progression ensure each APT feels unique across campaigns.

---

## Summary

Abstract Progress Trackers in Eclorean Ledger:

1. Represent complex or intangible concepts like Plague Spread or Rebellion Momentum.
2. Integrate seamlessly with events, listeners, and settlement mechanics.
3. Offer dynamic progression, thresholds, and decay for flexible storytelling.
4. Introduce Sub-APTs for granular tracking and emergent narratives.
5. Provide DMs with powerful tools for managing narrative arcs while maintaining player engagement.

This system ensures that abstract concepts feel tangible and impactful, enriching both gameplay and storytelling.
