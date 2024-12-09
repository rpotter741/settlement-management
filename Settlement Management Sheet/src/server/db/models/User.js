import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  settlements: [
    {
      settlementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Settlement' },
      role: {
        type: String,
        enum: ['dm', 'player', 'resident'],
        required: true,
      },
      characterName: { type: String, default: '' },
    },
  ],
});

export default mongoose.model('User', userSchema);
