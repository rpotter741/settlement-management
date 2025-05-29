import mongoose from 'mongoose';

import { PhaseSchema, ImpactSchema } from './Event.js';

const EventTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Immediate', 'Active', 'Passive', 'Indefinite'],
    required: true,
  },
  phases: [PhaseSchema], // Reusable steps/phases of the event
  impacts: { costs: [ImpactSchema], rewards: [ImpactSchema] }, // Shared impacts logic
  details: { type: String, default: '' },
  tags: { type: [String], default: [] },
  category: { type: String, required: true },
  metadata: {
    createdBy: { type: String, default: 'System' }, // e.g., 'System' or user ID
    createdAt: { type: Date, default: Date.now },
    isOfficial: { type: Boolean, default: false }, // For distinguishing curated content
  },
});

const EventTemplate = mongoose.model('EventTemplate', EventTemplateSchema);

export { EventTemplate, EventTemplateSchema };
