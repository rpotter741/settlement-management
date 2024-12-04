import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, default: 1 },
  hp: {
    current: { type: Number, default: 10 },
    max: { type: Number, default: 10 },
  },
  stats: {
    survival: { type: Number, default: 0 },
    safety: { type: Number, default: 0 },
    economy: { type: Number, default: 0 },
  },
  vault: { type: mongoose.Schema.Types.ObjectId, ref: 'Vault' }, // Reference to Vault model
  buildings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Building' }], // Reference to Building model
  upgrades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upgrade' }], // Reference to Upgrade model
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EventLog' }], // Reference to EventLog model
  customCategories: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'CustomCategory' },
  ], // Reference to custom categories
  weeksLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WeekLog' }], // Reference to weekly logs
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
      role: { type: String, enum: ['dm', 'player', 'citizen'], required: true },
    },
  ],
});

export default mongoose.model('Settlement', settlementSchema);
