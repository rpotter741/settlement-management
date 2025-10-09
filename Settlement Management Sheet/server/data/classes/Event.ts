export default class Event {
  constructor({
    id,
    name,
    scheduled,
    recurring,
    type,
    startDate,
    phases,
    autocomplete,
    guardImpact,
    severity,
    category,
    details,
    hide = false,
    link = null,
    tags = [],
    votes = { options: [], voterIds: [] },
  }) {
    this.id = id || `event-${Date.now()}`; // Unique ID
    this.name = name; // Event name
    this.scheduled = scheduled; // boolean for whether the event is scheduled or not
    this.recurring = recurring; // boolean for whether the event starts again once completed
    this.type = type; // Immediate, Active, Passive, Indefinite
    this.startDate = startDate; // for calendar rendering and projections
    this.phases = phases; // array of phase objects
    this.timeInDays = null; // Duration (null for indefinite)
    this.phaseComplete = false; // boolean for whether the current phase is complete
    this.autocomplete = autocomplete || false; //boolean for whether or not an event is automatically progressed to the next phase -- can also be used to automate building production instead of manually incrementing phase
    this.currentPhase = 0;
    this.totalPhases = this.phases.length;
    this.guardImpact = guardImpact; // object with keys location, category, value, which is a percentage of reduction to event damages, and prevent, which is the minimum number of garrison assigned to prevent the event
    this.severity = severity || 'Moderate'; //Low, Moderate, High, Extreme (.5, 1, 1.5, 2 cost multipliers)
    this.category = category; // required for dynamic event generation;
    this.details = details || ''; // Optional description
    this.workers = 0; // Number of workers assigned to the event
    this.hide = hide; // Display status
    this.link = link; // Optional linked event
    this.tags = tags; // Optional tags for filtering
    this.votes = votes; // Optional voting object for events with multiple resolution options
  }

  /*
  Example phases object:
  {
    name: 'Preparing Build Site',
    details: 'Clearing debris and preparing the site for construction.',
    startDate: undefined // starts undefined, but when a phase is entered the date is set
    timeInDays: // can be null for indefinite/active/immediate, otherwise resolved after this number of days
    laborNeeded: 10, //can be null for passive/indefinite events
    laborProgress: 0, // tracks the progress of labor towards completion
    completed: false, // boolean for whether the phase is complete
    cost: [
      { name: 'supplies', quantity: 3},
      { name: 'gold', quantity: 30}
    ],
    reward: [
      { name: 'defensiveInfrastructure', quantity: 1}
    ],
  }

  Example event object:
  {
    id: 'event-1',
    name: 'Build Wall',
    scheduled: false,
    type: 'Active',
    timeInDays: 10,
    startDate: '2021-01-01',
    phases: [
      {
        name: 'Preparing Build Site',
        details: 'Clearing debris and preparing the site for construction.',
        startDate: undefined,
        timeInDays: 3,
        laborNeeded: 10,
        laborProgress: 0,
        completed: false,
        impacts: {
        costs: [
        {
          type: 'category',
          category: 'Survival',
          attribute: 'supplies',
          key: 'current',
          baseAmount: 3,
          immutable: false,
        }],
        rewards: [
      {
        type: 'status',
        category: 'Inspired',
        attribute: null,
        key: null,
        baseAmount: 1,
        immutable: true,
        }],
        }
      },
      {
        name: 'Building Wall',
        details: 'Constructing a defensive wall.',
        startDate: undefined,
        timeInDays: 7,
        laborNeeded: 15,
        laborProgress: 0,
        completed: false,
        impacts: {
          costs: [
          {
            type: 'category',
            category: 'Survival',
            attribute: 'supplies',
            key: 'current',
            baseAmount: 3,
            immutable: true,
          },
          {
            type: 'settlement',
            category: 'Vault',
            attribute: 'gold',
            key: null,
            baseAmount: 350,
            immutable: true,
          }
          ],
          rewards: [
          {
            type: 'category',
            category: 'Safety',
            attribute: 'defensiveInfrastructure',
            key: 'bonus',
            baseAmount: 1,
            immutable: true,
          }
          ],

        }
      },
    ],
    autocomplete: false,
    details: 'A defensive wall will provide protection from enemy attacks.',
  }

  example event 2:
  {
    name: 'Burglary',
    scheduled: false,
    recurring: false,
    type: 'Immediate',
    timeInDays: null,
    startDate: 1,
    phases: [
      {
        name: 'Breaking and Entering',
        details: 'Thieves break into the market and steal supplies.',
        startDate: 1,
        timeInDays: null,
        laborNeeded: null,
        laborProgress: 0,
        completed: false,
        impacts: {
          costs: [
          {
            type: 'category',
            category: 'Survival',
            attribute: 'supplies',
            key: 'current',
            baseAmount: 3,
            immutable: false,
          }],
          rewards: [],
        }
},
  phaseComplete: false,
  autocomplete: false,
  currentPhase: 0,
  totalPhases: 1,
  guardImpact: { location: 'Market', category: 'Trade', value: 30, prevent: 3 },

  }
*/

  initialize() {
    if (this.phases.length > 0) {
      this.details = this.phases[0].details;
      this.laborNeeded = this.phases[0].laborNeeded;
      this.timeInDays = this.phases[this.currentPhase].timeInDays;
      this.phases[0].startDate = this.startDate;
    } else {
      console.warn('Event has no phases defined.');
    }
  }

  addWorker() {
    this.workers += 1;
  }

  removeWorker() {
    this.workers -= 1;
  }

  progressTime(turnDurationInDays = null) {
    if (turnDurationInDays !== null) {
      this.decrementTime(turnDurationInDays);
    }
    this.allocateLabor();

    this.checkPhaseCompletion();
  }

  decrementTime(days) {
    if (this.timeInDays !== null) {
      this.timeInDays -= days;
    }
  }

  allocateLabor() {
    this.phases[this.currentPhase].laborProgress += this.workers;
  }

  allocateReward() {
    this.details = this.phases[this.currentPhase].details;
    return this.phases[this.currentPhase].reward;
  }

  checkPhaseCompletion() {
    if (this.isPhaseComplete()) {
      this.phaseComplete = true;
      this.phases[this.currentPhase].completed = true;
      if (this.autocomplete) {
        this.advancePhase();
        if (this.isExpired()) {
          this.hide = true;
          return this.allocateReward();
        }
      }
    }
  }

  advancePhase(currentDay) {
    if (currentDay === undefined) {
      console.warn('Current day is required to advance phase.');
      return;
    }
    if (this.currentPhase < this.totalPhases - 1) {
      console.info(
        `Phase ${this.currentPhase} completed for event ${this.name}`
      );
      this.currentPhase += 1;
      this.details = this.phases[this.currentPhase].details;
      this.laborNeeded = this.phases[this.currentPhase].laborNeeded;
      this.timeInDays = this.phases[this.currentPhase].timeInDays;
      this.phases[this.currentPhase].startDate = currentDay;
    }
  }

  refundEvent() {
    let refund = [];
    this.phases.forEach((phase, i) => {
      if (i <= this.currentPhase) {
        const newCost = phase.cost.map((cost) => {
          return { name: cost.name, quantity: Math.floor(cost.quantity * 0.5) };
        });
        refund.push(newCost);
      } else {
        if (this.autocomplete) {
          refund.push(phase.cost);
        }
      }
    });
    refund.flat();
    return refund;
  }

  getPhaseProgress() {
    const phase = this.phases[this.currentPhase];
    const progress = phase.laborProgress / phase.laborNeeded;
    return {
      phaseProgress: progress,
      totalProgress:
        progress === 1
          ? this.currentPhase / this.totalPhases
          : (this.currentPhase - 1) / this.totalPhases,
    };
  }

  getVoteOptions() {
    return this.votes.options;
  }

  castVote(playerId, optionIndex) {
    this.votes.voterIds.push(playerId);
    this.votes.options[optionIndex].votes += 1;
  }

  didVote(playerId) {
    return this.votes.voterIds.includes(playerId);
  }

  /*

    Example votes object:
    const votes = {
      options: [
        { name: 'Demolish and Rebuild', description: 'Demolish what remains and rebuild.', type: Event, impacts: <EventObject>, votes: 0 },
        { name: 'Repair Granary', description: 'Take the time to assess what can be salvaged are needed and clean up the debris from the fire and then repair.', type: Event, impacts: <EventObject>, votes: 0 },
      ],
      voterIds: [],
    };

  */

  resolveVote(settlement) {
    const winningOption = this.votes.options.reduce((max, option) => {
      return option.votes > max.votes ? option : max;
    });

    if (!winningOption) {
      console.warn('No winning option found.');
      return;
    }

    switch (winningOption.type) {
      case 'Event':
        settlement.eventsLog.addEvent(winningOption.impact);
        break;
      case 'Resource':
        settlement.applyImpacts(winningOption);
    }
  }

  checkCompletion(currentDay, scope = 'phase') {
    if (currentDay === undefined) {
      console.warn('Current day is required to check completion.');
      return false;
    }

    const phase = this.phases[this.currentPhase];

    if (!phase) {
      console.warn('No current phase found. Ensure phases are defined.');
      return false;
    }

    // Check if labor or time has completed the current phase
    const laborComplete = phase.laborNeeded
      ? phase.laborProgress >= phase.laborNeeded
      : false;
    const timeComplete = phase.timeInDays
      ? (phase.startDate ? currentDay - phase.startDate : 0) >= phase.timeInDays
      : false;

    if (scope === 'phase') {
      // Check if the current phase is complete
      return laborComplete || timeComplete;
    }

    if (scope === 'event') {
      // Check if the event has completed all phases
      const isFinalPhase = this.currentPhase === this.totalPhases - 1;
      return isFinalPhase && (laborComplete || timeComplete);
    }

    console.warn('Invalid scope provided. Use "phase" or "event".');
    return false;
  }
}
