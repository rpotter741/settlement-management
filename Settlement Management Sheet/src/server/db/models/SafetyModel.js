import mongoose from 'mongoose';

const safetySchema = new mongoose.Schema({
  bonus: { type: Number, default: 0 }, // Global safety bonus

  defense: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 }, // Calculated max value
  },

  intel: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  garrison: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  score: { type: Number, default: 0 }, // Derived score
  rating: {
    type: String,
    enum: [
      'Dangerous',
      'Lawless',
      'Unsafe',
      'Safe',
      'Guarded',
      'Protected',
      'Impregnable',
    ],
  }, // Derived rating
});

export default mongoose.model('Safety', safetySchema);
