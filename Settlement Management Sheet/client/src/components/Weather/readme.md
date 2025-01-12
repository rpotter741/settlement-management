# Weather System

The Weather system tracks and manages the environmental conditions of a settlement, applying mechanical impacts, influencing events, and adding narrative depth. It integrates with the calendar and season mechanics to create immersive, regionally appropriate weather patterns while supporting full customization.

## Core Components

### 1. Weather Types

**Definition:** Represents the current weather state, varying by biome, season, and severity.

**Key Features:**

- Defined by steps of severity (1–5), with impacts scaling accordingly.
- Includes curated biome-specific weather types:

**Example:** Rain in a forest boosts Food and slightly damages Shelter, while rain in a desert may cause flash floods.

Dynamic transition probabilities influence the likelihood of changing weather types over time.

#### Examples:

**Temperate Summer:**

- Clear and Sunny (50%)
- Rainy (30%)
- Stormy (15%)
- Windy (5%)

**Desert Winter:**

- Dry (80%)
- Windstorm (15%)
- Rare Rain (5%)

### 2. Weather Impacts

**Definition:** The mechanical effects applied to settlement attributes by Weather Types.

**Key Features:**

- Positive, negative, or mixed impacts based on severity and region.
- Duration-based modifiers for prolonged weather conditions.

**Examples:**

- Rainy (Step 2):
- Forest: Food +2, Shelter -1.
- Desert: Food +1, Shelter -2.
- Stormy (Step 3):
- Temperate Region: Shelter -3, Trade -2.
- Tropical Region: Trade -1, Garrison -2.

### 3. Weather Trackers

**Definition:** Tracks weather progression, duration, and escalation for dynamic narrative and mechanical interactions.

#### Key Features:

**Tracks:**

- **Duration:** How long a Weather Type persists.
- **Escalation Probabilities:** Likelihood of escalating to a more severe type.
- Integrates with Listeners for event recommendations:
- **Example:** Rain lasting 4 turns activates Listeners for flooding in the desert or crop growth in the forest.
- Supports narrative hooks:
- **Example:** A prolonged Sandstorm triggers “Supply Shortages” or “Buried Caravan” events.

### 4. Calendar and Seasons

**Definition:** Weather progression is tied to seasonal patterns and regional characteristics.

**Key Features:**

- Seasonal defaults determine baseline probabilities for Weather Types:
- Example: Tropical Winter → Rainy (40%), Stormy (25%), Clear (20%), Humid (15%).

#### DMs can:

- Override seasonal patterns to create unique narratives.
- Customize probabilities and impacts via the Calendar or Season interface.

**Manual control:**

- DMs can manually select Weather Types and severities for specific narrative beats.

### 5. Unique and Custom Weather

**Definition:** Supports unusual and unique weather phenomena tailored to fantasy or sci-fi settings.

**Key Features:**

- Custom Weather Types: Created using the Weather Editor tool, including name, severity steps, impacts, and optional tags.

**Examples:**

- Firestorm: Shelter -5, Garrison -3.
- Arcane Hurricane: Trade -3, Mana Pool -4 (if applicable).

**Biome flexibility:**

**Example:**

Sandstorm in a mountain biome during a magical event.

**Integration:**

- Custom weather can recommend unique events:

- Example: Prolonged Firestorm triggers “Ashfall Crisis.”

### 6. Integration with Listeners

Weather Trackers directly interact with Listeners to recommend events.

**How It Works:**

- Weather Tags (optional): Tie Weather Types to specific Listener Packs.
- Example: arcane tag triggers magical fallout events, while storm tag increases weights for flooding events.

**Dynamic Progression:**

- Weather conditions affect settlement attributes, activating relevant Listeners (e.g., prolonged rain lowering Shelter triggers unrest-related events).

### 7. UI/UX for Weather Management

**Definition:** Designed for DM flexibility and clarity.

**Key Features:**

- Weather Tracker Dashboard:
- Dropdown menu for selecting current Weather Type and severity.
- Visual indicators for severity steps and their impacts.

**Manual Overrides:**

- DMs can toggle weather manually or adjust progression probabilities.

**Season Integration:**

- Calendar view showing seasonal weather patterns and probabilities.
- Editable transitions and impacts for complete customization.

### Summary

The Weather system dynamically weaves environmental conditions into settlement mechanics and narratives. With curated biome-specific weather, customizable impacts, and integration into Listeners, it provides both depth and flexibility for DMs. Unique weather types and full customization ensure that every campaign world can feel alive and reactive.
