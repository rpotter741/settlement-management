# Event System Summary

## Overview

Events are modular narrative tools that bring a living world to life. Each event offers dynamic storytelling through phases, resolutions, and narrative hooks, all tailored to settlement state and user customization.

---

## Core Properties

### 1. **Name and Description**

- **Name**: The event's title.
- **Description**: Primary narrative text describing the event.
- **Optional Flavor Text**: Alternate descriptions based on severity, defaulting to the primary description if not provided.

### 2. **Tags**

- Tags categorize events and connect them to Listeners, ensuring thematic relevance and appropriate recommendations.

### 3. **Severity**

- Events are assigned a **Severity Level** upon recommendation:
  - **Levels**: Trivial, Minor, Moderate, Major, Pivotal.
  - **Impact Multipliers**: 50%, 75%, 100%, 125%, 150% of base impacts, scaled by settlement level unless the **Immutable Flag** is toggled.
- **Manual Adjustment**: DMs can use a 0–200% slider to adjust severity, allowing for narrative or dramatic flexibility.

### 4. **Hook-Out Frequency**

- Determines the chance (e.g., 5%, 10%) of an event leaving a Hook-Out for future narrative threads.

---

## Phases

### 1. **Types of Phases**

- **Immediate**: Occurs instantly with no delay.
- **Active**: Requires DM or player intervention, typically involving resources like the Labor Pool.
- **Passive**: Progresses over time without player influence (e.g., weather effects).
- **Indefinite**: Requires resolution outside the app (e.g., in the TTRPG) while maintaining mechanical impacts.

### 2. **Phase Progression**

- Phases are sequential but may include a **Start Phase at Event Start** toggle, allowing multiple phases to occur simultaneously.

### 3. **Costs and Rewards**

- **Costs**: Represent losses or penalties at the start of a phase (e.g., resource consumption).
- **Rewards**: Represent gains or resolutions upon phase completion (e.g., morale boost, repairs).

### 4. **Dynamic Progression**

- Phases can progress automatically or require DM approval, emphasizing narrative control.

---

## Resolutions

### 1. **Resolution Options**

- Provide choices for how the event is resolved:
  - Example: "Save the warehouse (protect resources) or save the barracks (preserve defense)."
- Players and/or DMs vote on resolutions, or the DM can select one directly.

### 2. **Hook-Outs**

- Each resolution exposes a unique Hook-Out, tying into future narrative threads.
- Hook-Outs include details (e.g., affected regions or landmarks) to enable narratively logical follow-ups.

---

## Event Linking

### 1. **Linked Events**

- Events can directly link to another event, creating immediate follow-ups or cascading sequences.
- **Difference from Hook-Outs**:
  - Linked Events trigger directly as part of the same chain.
  - Hook-Outs expose potential narrative threads for later Listener activation.

### 2. **Delays**

- Linked Events can include a **Link Delay** setting to pace the story over multiple turns.

---

## Dynamic Scaling

### 1. **Settlement Level**

- Costs and rewards are scaled by settlement level to reflect its size and complexity.
- Immutable events ignore level scaling, ensuring consistent impacts.

### 2. **Severity Adjustments**

- The severity slider (0–200%) enables DMs to adjust impacts and rewards dynamically:
  - **Presets**: Narrative-Only, Balanced, High-Stakes.

---

## UI Features

### 1. **Event Cards**

- Display event details, including:
  - Name, description, tags, severity, costs, rewards, and current phase.
- Inline editing allows DMs to adjust details on the fly.

### 2. **Phases and Progression**

- Events with multiple phases include:
  - Current phase and status (e.g., Active, Passive).
  - Timeline or checklist view for phase progression.

### 3. **Resolution Selection**

- Hovering over a resolution shows:
  - Associated costs and rewards.
  - Exposed Hook-Out details for follow-up context.

### 4. **Canvas for Complex Events**

- Complex events (or Story Threads/Tapestries) are displayed as nodes:
  - **Solid Lines**: Represent linked events.
  - **Dotted Lines**: Represent Hook-Out/Hook-In relationships.
- Filters allow DMs to view active, resolved, or incomplete nodes.

---

## Key Design Features

### 1. **Modularity**

- Events are made up of modular components (phases, resolutions, links) for maximum flexibility and reusability.

### 2. **Narrative Cohesion**

- Hook-Outs ensure logical follow-ups by embedding narrative context (e.g., affected landmarks or regions).

### 3. **Player Engagement**

- Resolution options and voting mechanics bring players into the storytelling process, increasing immersion.

### 4. **DM Control**

- Options for auto-phasing, severity adjustment, and resolution override keep the DM in full control of the narrative.

---

## Future Considerations

### 1. **Tagged Resolutions**

- Adding tags to resolutions could help with filtering and thematic alignment.

### 2. **Event Complexity Indicators**

- Include complexity metrics (e.g., number of phases, linked events, Hook-Outs) for DM reference.

### 3. **Dynamic Conditions**

- Allow Passive or Indefinite phases to transition into Active phases based on settlement state or other triggers.

### 4. **Expanded Linking Logic**

- Introduce settings for flexible event pacing through advanced link delay options.

---
