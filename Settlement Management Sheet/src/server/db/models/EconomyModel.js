import mongoose from 'mongoose';

const economySchema = new mongoose.Schema({
  bonus: { type: Number, default: 0 }, // Global economy bonus

  trade: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 }, // Calculated based on level and bonuses
  },

  craftsmanship: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  laborPool: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },

  score: { type: Number, default: 0 }, // Derived score
  rating: {
    type: String,
    enum: ['Struggling', 'Fragile', 'Stagnant', 'Growing', 'Prosperous', 'Thriving', 'Golden Era'],
  }, // Derived rating based on score
});

export default mongoose.model('Economy', economySchema);
