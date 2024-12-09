import mongoose from 'mongoose';
import { PhaseSchema } from './EventModel';

const { Schema, model } = mongoose;
// Branch Schema
const BranchSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true }, // Level of the branch upgrade
  description: { type: String, default: '' },
  phases: [PhaseSchema], // Array of phase objects
  mutuallyExclusive: { type: Boolean, default: true }, // Whether this branch blocks others
  next: [{ type: Schema.Types.ObjectId, ref: 'Branch' }], // References to other branches
});

// Building Schema
const BuildingSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  level: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Not Built', 'Under Construction', 'Completed'],
    default: 'Not Built',
  },
  branches: [BranchSchema], // Embedded branches
  official: { type: Boolean, default: false }, // If it's a predefined building
});

export default model('Building', BuildingSchema);
