import mongoose from 'mongoose';
import { EventSchema } from './Event';

const TurnLogSchema = new mongoose.Schema({
  turn: Number, // The turn number
  date: Date, // Timestamp for the turn
  settlementId: mongoose.ObjectId, // Reference to the settlement
  changes: [
    {
      category: String, // Category affected (e.g., "Food", "Safety")
      attribute: String, // Specific attribute (e.g., "current", "bonus")
      type: String, // Type of change ("increase", "decrease")
      value: Number, // Amount of change
      description: String, // Summary of what caused the change
    },
  ],
  events: [EventSchema], // A list of embedded event details
  notes: {
    shared: String, // Shared player notes
    private: [
      // Individual private notes
      {
        playerId: mongoose.ObjectId,
        note: String,
      },
    ],
  },
  summary: String, // Optional AI-generated summary
});

export default mongoose.model('TurnLog', TurnLogSchema);
