import mongoose from 'mongoose';
import EventSchema from './Event.js';

const { Schema } = mongoose;

// EventLog Schema
const EventLogSchema = new Schema({
  activeEvents: { type: [EventSchema], default: [] },
  severityMap: {
    low: { type: Number, default: 0.5 },
    moderate: { type: Number, default: 1 },
    high: { type: Number, default: 1.5 },
    extreme: { type: Number, default: 2 },
  },
});

export default EventLogSchema;
