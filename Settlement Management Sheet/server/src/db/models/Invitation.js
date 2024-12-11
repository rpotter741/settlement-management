import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  settlementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Settlement',
    required: true,
  },
  role: { type: String, enum: ['dm', 'player', 'resident'], required: true },
  expiresAt: { type: Date, required: true },
  uses: { type: Number, default: 0 }, // Tracks the number of times the invitation was used
  maxUses: { type: Number, default: 1 }, // Maximum allowed uses
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Tracks which users used the invitation
});

export default mongoose.model('Invitation', invitationSchema);
