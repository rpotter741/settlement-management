# Documentation

## Classes

### Building

#### Overview

The `Building` class represents a structure in the settlement. It manages the building's general metadata and tracks available upgrade paths through branches.

#### Properties

`name: string` – The name of the building.

`description: string` – A brief description of the building (default: '').

`level: number` – The current upgrade level of the building (default: 0).

`status: string` – The building's construction status, such as "Not Built" or "Upgraded" (default: 'Not Built').

`branches: Branch[]` – An array of available upgrade paths.

`official: boolean` – Whether the building is a predefined or custom structure (default: false).

#### Methods

`addBranch(branch: Branch): void`<br>
Adds a new branch to the building.

`findBranch(name: string): Branch | null`<br>
Finds a branch by name in the building's upgrade paths.

`upgrade(branchName: string): void`<br>
Upgrades the building to a specified branch.

#### Example Usage

```
const barracks = new Building({
  name: 'Barracks',
  description: 'Provides housing and training for troops.',
});

barracks.addBranch(new Branch({ name: 'Advanced Barracks', level: 2 }));
barracks.upgrade('Advanced Barracks');

```

### Branch

#### Overview

The `Branch` class represents an individual upgrade path for a building. Each branch may include multiple phases, costs, rewards, and potential next branches.

#### Properties

`name: string` – The name of the branch.

`level: number` – The level of the upgrade associated with this branch.

`description: string` – A brief description of the branch (default: '').

`phases: object[]` – An array of upgrade phases, each containing costs, rewards, time requirements, and labor needs.

`mutuallyExclusive: boolean` – Indicates if selecting this branch blocks others (default: true).

`next: Branch[]` – Array of potential next branches.

#### Methods

`addNext(branch: Branch): void`<br>
Adds a new branch to the next array.

`addPhase(phase: object): void`<br>
Adds a new phase to the branch.

`generateEventPhases(): object[]`<br>
Returns an array of event phases for integration with the event system.

#### Example Usage

```
const reinforcedWalls = new Branch({
  name: 'Reinforced Walls',
  level: 2,
  description: 'Stronger walls to withstand attacks.',
});

reinforcedWalls.addPhase({
  name: 'Reinforce Foundation',
  description: 'Strengthening the wall’s foundation.',
  timeInDays: 5,
  laborNeeded: 10,
  costs: [{ name: 'supplies', quantity: 6 }],
  rewards: [],
});
```

### Event

#### Overview

The `Event` class represents dynamic occurrences in the settlement, including phases for construction, upgrades, or narrative progression. It manages time, labor, costs, and rewards associated with an event.

#### Properties

`id: string` – A unique identifier for the event (default: event-{timestamp}).

`name: string` – The name of the event.

`scheduled: boolean` – Whether the event is pre-scheduled or not.

`type: string` – The type of the event ('Immediate', 'Active', 'Passive', 'Indefinite').

`timeInDays: number | null` – The remaining time for the event in days (null for indefinite events).

`startDate: number` – The starting day of the event (used for timeline calculations).

`phases: object[]` – An array of phase objects representing the steps required to complete the event.

`phaseComplete: boolean` – Whether the current phase is complete.

`autocomplete: boolean` – Whether phases automatically progress when completed.

`currentPhase: number` – The index of the currently active phase.

`totalPhases: number` – The total number of phases in the event.

`details: string` – Optional description of the event.

`workers: number` – The number of workers currently assigned to the event.

`hide: boolean` – Whether the event is hidden in the log.

`link: string` | null – An optional linked event ID.

#### Methods

`initialize(): void`<br>
Prepares the event by setting details, labor needs, and time for the first phase.

`addWorker(): void`<br>
Increases the number of workers assigned to the event.

`removeWorker(): void`<br>
Decreases the number of workers assigned to the event.

`progressTime(turnDurationInDays: number | null): void`<br>
Handles time progression and labor allocation for the event. If turnDurationInDays is provided, it decrements time; otherwise, it allocates labor.

`decrementTime(days: number): void`<br>
Reduces the remaining time for the event by a specified number of days.

`allocateLabor(): void`<br>
Allocates the assigned workers' progress to the current phase.

`allocateReward(): object[]`<br>
Returns the rewards associated with the current phase.

`checkPhaseCompletion(): void`<br>
Verifies whether the current phase is complete and progresses to the next phase if applicable.

`advancePhase(currentDay: number): void`<br>
Advances the event to the next phase, updating relevant details and setting the phase’s start date.

`refundEvent(): object[]`<br>
Returns a partial refund of costs for completed and future phases based on event progress.

`getPhaseProgress(): object`<br>
Returns the progress of the current phase and total event progress as percentages.

`isPhaseComplete(currentDay: number): boolean`<br>
Checks whether the current phase is complete based on labor or time elapsed.

`isExpired(): boolean`<br>
Determines whether the event is fully completed or expired.

#### Phase Object Structure

Each phase in the `phases` array is structured as follows:

```
{
  name: 'Phase Name',
  description: 'Phase description.',
  startDate: undefined, // Will be set when the phase starts
  timeInDays: 7, // Time required to complete the phase
  laborNeeded: 10, // Amount of labor required
  laborProgress: 0, // Tracks progress toward labor completion
  costs: [
    { name: 'gold', quantity: 30 },
    { name: 'supplies', quantity: 10 }
  ],
  rewards: [
    { name: 'defensiveInfrastructure', quantity: 5 }
  ],
  completed: false // Status of phase completion
}

```

#### Example Usage

```
const buildWallEvent = new Event({
  name: 'Build Wall',
  type: 'Active',
  timeInDays: 10,
  startDate: 1,
  phases: [
    {
      name: 'Prepare Build Site',
      description: 'Clearing debris and preparing the site.',
      timeInDays: 3,
      laborNeeded: 5,
      laborProgress: 0,
      costs: [{ name: 'gold', quantity: 20 }],
      rewards: [],
      completed: false,
    },
    {
      name: 'Construct Wall',
      description: 'Building the wall with stone and mortar.',
      timeInDays: 7,
      laborNeeded: 10,
      laborProgress: 0,
      costs: [{ name: 'stone', quantity: 50 }, { name: 'gold', quantity: 30 }],
      rewards: [{ name: 'defensiveInfrastructure', quantity: 10 }],
      completed: false,
    },
  ],
  autocomplete: true,
  details: 'Building a defensive wall to protect the settlement.',
});

```

### Event Log

#### Overview

The `EventLog` class manages active events within the settlement. It provides methods to add, remove, and retrieve events, and handles time-based progression for all events.

#### Properties

`activeEvents: Event[]` – An array of currently active events.

#### Methods

`addEvent(event: Event): void `<br>
Adds a new event to the active event log.

`removeEvent(eventId: string): void` <br>
Removes an event from the log based on its unique ID.

`getEvent(eventId: string): Event | null` <br>
Retrieves a specific event by its ID. Returns null if not found.

`getEventsByType(type: string): Event[]` <br>
Returns all events of a specified type (e.g., 'Active', 'Scheduled').

`decrementEventTimes(turnDurationInDays: number): void` <br>
Decrements the time remaining for all events with durations.
Removes expired events from the log automatically.

#### Example Usage

```
const eventLog = new EventLog();

const newEvent = new Event({
  name: 'Build Wall',
  type: 'Active',
  timeInDays: 10,
});

eventLog.addEvent(newEvent);
eventLog.decrementEventTimes(7); // Progress time by 7 days
eventLog.removeEvent(newEvent.id);

```

### Health

#### Overview

The `Health` class manages the settlement's health, including healing, damage, and bonuses from upgrades or events.

#### Properties

`current: number` – The current health of the settlement.

`maxHealthBase: number` – The base maximum health of the settlement.

`maxHealthBonus: number` – Additional health bonuses from upgrades.

`keyedHealthBonuses: object[]` - An array of objects describing pseudo-permanent health value changes

#### Methods

`setHealth(value: number): void` <br>
Sets the settlement’s current health to the specified value.

`heal(value: number): void` <br>
Increases the settlement’s health by the specified amount.

`damage(value: number): void`<br>
Decreases the settlement’s health by the specified amount.

`maxBonusPlus(value: number): void` <br>
Increases the maximum health bonus.

`maxBonusMinus(value: number): void` <br>
Decreases the maximum health bonus.

`maxBaseChange(value: number): void` <br>
Sets the base maximum health to the specified value.

`totalMaxHealth(): number`<br>
Returns the settlement’s total maximum health, including bonuses.

#### Example Usage

```
const health = new Health();

health.damage(20); // Reduce health by 20
health.heal(10); // Increase health by 10
console.log(health.totalMaxHealth()); // Get the total maximum health

```

### Infrastructure

#### Overview

The `Infrastructure` class manages all buildings in the settlement, including their statuses, upgrades, and interactions.

#### Properties

`buildings: Building[]` – An array of all buildings in the settlement.

#### Methods

`addBuilding(building: Building): void`<br>
Adds a new building to the infrastructure.

`removeBuilding(name: string): void`<br>
Removes a building by name.

`findBuilding(name: string): Building | null` <br>
Finds a building by name.

`filterBuildingsByStatus(status: string): Building[] `<br>
Retrieves all buildings with a specific status.

`calculateTotalCosts(): object` <br>
Calculates the total resource costs for all buildings.

`upgradeBuilding(name: string, branchName: string): void `<br>
Upgrades a building to the specified branch.

#### Example Usage

```
const infrastructure = new Infrastructure();
const barracks = new Building({ name: 'Barracks' });

infrastructure.addBuilding(barracks);
infrastructure.upgradeBuilding('Barracks', 'Advanced Barracks');
```

### Settlement

#### Overview

The `Settlement` class encapsulates all aspects of a settlement, including its buildings, events, health, and overarching game state.

#### Properties

`name: string` – The name of the settlement.

`type: string` – The type of settlement (e.g., village, city).

`level: number` – The current level of the settlement.

`categories: object[]` – An array of categories, including custom ones, for tracking settlement-specific stats.

`infrastructure: Infrastructure` – An object managing all buildings and upgrades.

`eventsLog: EventLog` – An instance of the EventLog class to track events.

`health: Health` – An instance of the Health class to track settlement health.

`taxImpacts: object` – An object tracking tax modifiers (e.g., { flood: -0.25 }).

`weeklyLog: string[]` – A log of weekly changes and historical records.

`notes: object` – Player-specific notes (private) and shared notes (shared).

#### Methods

`addCategory(category: object): void `<br>
Adds a new custom category to the settlement.

`applyWeeklyChanges(): void` <br>
Applies changes from events, weather, morale, and taxes to the settlement state.

`getTaxRate(): numb`er <br>
Calculates the effective tax rate, considering impacts from taxImpacts.

`logWeeklySummary(summary: string): void` <br>
Adds a new entry to the weekly log.

#### Example Usage

```
const settlement = new Settlement({
  name: 'Riverwatch',
  type: 'Village',
  level: 1,
});

settlement.infrastructure.addBuilding(new Building({ name: 'Walls' }));
settlement.health.damage(10); // Decrease settlement health by 10
settlement.logWeeklySummary('Floods reduced food production by 15%.');

```
