const UpgradeSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Settlement type (e.g., Survivalist, Fortified)
  level: { type: Number, required: true }, // Level the upgrade unlocks
  title: { type: String, required: true }, // Upgrade name
  description: { type: String, required: true }, // Narrative description
  impacts: {
    rewards: [{ type: Object }], // Reuse impacts structure
    costs: [{ type: Object }],
  },
  selected: { type: Boolean, default: false }, // If the upgrade is selected
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Upgrade' }], // Other upgrades required
  requiresApproval: { type: Boolean, default: false }, // DM approval required
  exclusivityGroup: { type: String, default: null }, // Group for mutually exclusive upgrades
  nextUpgrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upgrade',
    default: null,
  }, // Linked upgrade
  tags: [{ type: String }], // Optional keywords for filtering
  unlockDate: { type: Date, default: null }, // In-game date for availability
  tier: { type: Number, default: null }, // Optional tier
});

const Upgrade = mongoose.model('Upgrade', UpgradeSchema);

export { Upgrade, UpgradeSchema };
