import mongoose from 'mongoose';

/*
const Holiday = new mongoose.Schema({
  name: { type: String, required: true },
  date: {
    month: { type: String, required: true},
    day: { type: Number, required: true },
    weekday: { type: String, required: true },
  },
  description: { type: String, required: true },
  events: { type: [EventSchema], default: [] },
  recurring: { type: Boolean, default: false },
});

const Calendar = new mongoose.Schema({
  days: { type: Number, default: 0 }, // Number of days in the calendar
  months: { type: Number, default: 0 }, // Number of months in the calendar
  years: { type: Number, default: 0 }, // Number of years in the calendar
  daysOfWeek: { type: Array, default: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] }, // Days of the week
  monthsOfYear: { type: Array, default: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] }, // Months of the year)
  currentDate: { type: Date, default: Date.now }, // Current date in the calendar
  holidays: { type: [] }, // Holidays in the calendar

const GameLogic = new mongoose.Schema({
  globalMultiplier: { type: Number, default: 1 }, // Multiplier for scaling events/resources
  eventTypeMultiplier: { type: Map, of: Number, default: {} }, // Multiplier for specific event types (specific resources, etc)
  gameDay: { type: Number, default: 0 }, // Current day of the game
  calendar: { type: mongoose.Schema.Types.ObjectId, ref: 'Calendar' }, // Calendar object
  timeScale: { type: String, enum: ['Default', 'Realistic'], default: 'Default' }, // Time scale

})
*/

export const GameLogic = mongoose.model('GameLogic', GameLogicSchema);
export { GameLogicSchema };

/*

Cool. Also, I need help implementing an idea I have. Mainly I don't know where it should go.

I want to set up some condition trackers that would be toggle-able by the DM. They would be things like Unrest, Rebellion, Famine, any sort of 'objective-based' condition that could affect a settlement. They would only need methods to adjust their value as well as specify if the goal is a low score (like unrest) or a high one (like Satisfaction).

These would help display narrative-focused elements of a game that can be difficult to manually keep track of in a table-only game. Are you smelling what I'm stepping in here?

*/
