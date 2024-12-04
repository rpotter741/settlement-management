import mongoose from 'mongoose';

const survivalSchema = new mongoose.Schema({
  bonus: { type: Number, default: 0 }, // Global survival bonus
  food: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 }, // Precomputed for efficiency
  },
  supplies: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  medical: {
    current: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
  },
  score: { type: Number, default: 0 }, // Derived value
  rating: { type: String, enum: ['Dying', 'Endangered', 'Desperate', 'Stable', 'Developing', 'Blossoming', 'Flourishing'] },
});

export default mongoose.model('Survival', survivalSchema);
