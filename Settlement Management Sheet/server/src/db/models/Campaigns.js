import mongoose from 'mongoose';
import { SettlementSchema } from './Settlement'; // Assuming you already have this
import { GameLogicSchema } from './gameLogic'; // Assuming you already have this

const CampaignMetadataSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the campaign
  description: { type: String, default: '' }, // Campaign description
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    required: true,
  },
  tags: { type: [String], default: [] }, // Tags for filtering/searching
  author: { type: String, default: 'Official' }, // Author or creator of the campaign
  createdAt: { type: Date, default: Date.now },
  official: { type: Boolean, default: false }, // Whether this is an official campaign
});

const CampaignModifiersSchema = new mongoose.Schema({
  globalMultiplier: { type: Number, default: 1 }, // Multiplier for scaling events/resources
  uniqueStatuses: { type: [String], default: [] }, // Unique statuses tied to this campaign
  uniqueEvents: { type: [String], default: [] }, // Unique events tied to this campaign
});

const CampaignSchema = new mongoose.Schema({
  metadata: { type: CampaignMetadataSchema, required: true }, // Metadata for the campaign
  settlement: { type: SettlementSchema, required: true }, // Pre-filled settlement object
  gameLogic: { type: GameLogicSchema, required: true }, // Campaign-specific gameLogic
  modifiers: { type: CampaignModifiersSchema, default: {} }, // Modifiers for campaign-specific rules
});

export const Campaign = mongoose.model('Campaign', CampaignSchema);
