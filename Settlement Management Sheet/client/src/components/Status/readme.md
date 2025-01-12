Statuses System
Statuses represent the societal state of the settlement’s population. They function similarly to Weather, using steps to determine severity, but focus on internal morale and sentiment rather than external environmental conditions. Statuses integrate with Listeners, decay over time, and can optionally balance impacts across the population for simulation-heavy tables.

Core Components

1. Status Conditions
   Definition: Statuses reflect the general morale or sentiment of the settlement’s population.
   Key Features:
   Defined by steps of severity (e.g., Content → Inspired or Afraid → Riotous).
   Affect settlement attributes or event recommendations based on their current state.
   Examples:
   Content:
   Step 1: Morale +2, Productivity +1%.
   Step 2 (Inspired): Morale +3, Productivity +2%.
   Afraid:
   Step 1: Morale -2.
   Step 2 (Riotous): Morale -4, Labor Pool -2.
2. Decay
   Definition: Statuses naturally tend toward neutrality unless reinforced by actions or events.
   Key Features:
   Decay Rates: Each Status has a customizable decay rate:
   Positive statuses decay faster (e.g., -5% per turn for Content).
   Negative statuses decay more slowly (e.g., -2% per turn for Afraid).
   Interactive Decay:
   Events or player actions can accelerate or slow decay.
   Example: A festival accelerates decay of Discontent while boosting Content temporarily.
   Customizability:
   Decay rates are editable by the DM to fit the narrative or mechanical needs of the campaign.
3. Integration with Listeners
   Statuses tie directly into the Listeners system to recommend events.
   How It Works:
   Status conditions (e.g., Afraid > Step 2) activate Listeners that recommend events:
   Example: Afraid triggers unrest or safety-related events.
   Example: Inspired triggers cultural festivals or economic boons.
   Dynamic Interactions:
   Statuses can influence Listeners indirectly by modifying settlement attributes (e.g., lowering Morale impacts Safety).
4. Optional Secondary Balancing Mode
   Definition: This mode dynamically balances the distribution of population statuses and adjusts their impacts proportionally.
   Key Features:
   Population Spread:
   Each Status tracks the percentage of the population affected:
   Example:
   Content: 70%.
   Neutral: 15%.
   Discontent: 5%.
   Proportional Impacts:
   Each Status contributes a proportional share of its maximum bonus/penalty:
   Example:
   Content (+2% productivity) → Final Bonus: 70% × 2% = +1.4%.
   Discontent (-2% productivity) → Final Penalty: 5% × -2% = -0.1%.
   Category Integration:
   Status impacts can optionally boost or reduce specific Categories:
   Example:
   Content increases bonuses in Culture and Trade.
   Discontent reduces Safety and Economy.
   Customizability:
   Toggleable in settings for simulation enthusiasts:
   “Enable Dynamic Population Modeling: Adjust settlement impacts based on the distribution of population statuses.”
5. UI/UX for Statuses
   Dashboard Overview:
   Displays current statuses, their steps, and impacts.
   Example:
   diff
   Copy code
   Status Conditions:

- Content (Step 2 - Inspired): Morale +3, Productivity +2%.
- Discontent (Step 1): Labor Pool -1.
  Decay Indicators:
  Visual representation of decay rates and time to neutrality.
  Example: “Content decays in 3 turns unless reinforced.”
  Customization Interface:
  DMs can adjust:
  Decay rates.
  Population spread (in secondary mode).
  Status impacts and integration with Listeners.
  Summary
  The Statuses system dynamically tracks the population’s morale and sentiment, influencing both settlement mechanics and narrative events. Decay mechanics ensure natural progression toward neutrality, while the optional secondary balancing mode adds granular control for simulation-heavy campaigns. With full integration into Listeners and dynamic customization, Statuses provide a robust tool for DMs to reflect the evolving state of their settlements.
