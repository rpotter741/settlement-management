# Event Logic Design Document

## Overview

This document outlines the core systems and logic behind the event generation, recommendation, and execution process in the Eclorean Ledger application. It serves as a reference for understanding and refining the mechanics, ensuring consistency, and aiding future development.

---

## Core Systems

### 1. **Listeners**

Listeners are modular conditions that evaluate the state of the settlement and activate when their criteria are met. They serve as the backbone for event recommendation.

#### Structure

- **Condition:** Defines when the listener activates (e.g., `food < 5` or `medicalCapacity <= 2`).
- **Tags:** Linked event tags to suggest relevant events.
- **Weight Modifiers:** Adjusts how likely the listener's events are to be selected.

#### Example

```json
{
  "id": "famine_listener_001",
  "condition": {
    "attribute": "food",
    "operator": "<",
    "value": 5
  },
  "tags": ["famine", "scarcity"],
  "weightModifier": 1.5
}
```

### 2. Event Algorithm

The algorithm determines which events are recommended each turn. It balances settlement conditions, listener activation, and randomness for emergent gameplay.

#### Steps

##### 1. Listener Activation

- Evaluate all active listeners against the settlement state.
- Return a list of listeners that meet their conditions.

##### 2. Event Pool Creation

- Combine events tied to the activated listeners.
- Apply initial weights from tags, listener modifiers, severity

##### 3. Weight Adjustment

- Adjust weights dynamically based on:
  - Recent events (e.g., suppress frequent tags)
  - Attribute values (e.g., famine weight increases certain attribute tags, eg edible, are low)

##### 4. Recommendation

- Randomly select events based on weights
- Limit to the DM-specified number of events per turn.

##### 5. Event Execution

- Present the recommended events to the DM for approval
- Log approved events and update settlement state

### 3. Hooks

Hooks connect events dynamically, enabling emergent storylines. They allow events to cascade naturally, creating a narrative arc.

#### Structure

- Hook-Out: A unique key attached to an event that signals a narrative thread.
- Hook-In: Another event’s ability to recognize and build on the Hook-Out.

#### Example

- Event 1: Severe Storm with Hook-Out storm_aftermath.
- Event 2: Repair Damages with Hook-In storm_aftermath.

### Tags

#### Attribute Tags

Tags assigned to settlement attributes influence how they interact with events.

#### Categories

- Resource Properties: flammable, durable, renewable
- Thematic Tags: arcane, religious, agricultural
- Situational Tags: essential, strategic, edible

#### Event Tags

Tags define the thematic and mechanical nature of events and interact with attribute tags.

##### Examples

- Famine: Targets food with scarcity and essential tags.
- Fire: Targets flammable attributes, reducing durable.

### Pseudocode Examples

#### Listener Activation

```javascript
function activateListeners(settlement, listeners) {
  return listeners.filter((listener) => {
    const { attribute, operator, value } = listener.condition;
    const settlementValue = settlement.attributes[attribute]?.current || 0;
    return evaluateCondition(settlementValue, operator, value);
  });
}

function evaluateCondition(value, operator, target) {
  switch (operator) {
    case '<':
      return value < target;
    case '<=':
      return value <= target;
    case '>':
      return value > target;
    case '>=':
      return value >= target;
    case '==':
      return value === target;
    default:
      return false;
  }
}
```

#### Event Selection

```javascript
function selectEvents(activatedListeners, eventPool, maxEvents) {
  const weightedPool = eventPool.map((event) => ({
    event,
    weight: calculateWeight(event, activatedListeners),
  }));

  const sortedPool = weightedPool.sort((a, b) => b.weight - a.weight);
  return sortedPool.slice(0, maxEvents).map((item) => item.event);
}

function calculateWeight(event, listeners) {
  let baseWeight = event.baseWeight || 1;
  listeners.forEach((listener) => {
    if (listener.tags.some((tag) => event.tags.includes(tag))) {
      baseWeight *= listener.weightModifier;
    }
  });
  return baseWeight;
}
```
