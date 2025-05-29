import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  // Basic authentication info
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Settlements the user is part of
  settlements: [
    {
      settlementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Settlement' },
      role: {
        type: String,
        enum: ['dm', 'player', 'resident'], // Role in the settlement
        required: true,
      },
      characterName: { type: String, default: '' }, // Optional in-game identity
    },
  ],

  // Tracking custom assets
  customAssetCount: { type: Number, default: 0 }, // Total number of user-created custom items
  customAssets: {
    type: Map,
    of: Number, // Tracks count per asset type, e.g., { 'Statuses': 5, 'Templates': 10 }
    default: {},
  },

  // User preferences for personalizing the app
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }, // Theme preference
    notifications: { type: Boolean, default: true }, // Email notifications toggle
  },

  // Activity tracking
  lastLogin: { type: Date, default: Date.now }, // Timestamp of the user's last login
  createdAt: { type: Date, default: Date.now }, // Account creation timestamp

  // Subscription tier (for monetization purposes)
  subscription: {
    tier: { type: String, enum: ['free', 'premium'], default: 'free' }, // User subscription tier
    expiration: { type: Date, default: null }, // Expiration date for premium access
  },

  // Public profile options
  publicProfile: {
    bio: { type: String, default: '' }, // User bio
    avatarUrl: { type: String, default: '' }, // URL for user avatar
    isPublic: { type: Boolean, default: false }, // Whether the profile is public
  },
});

// Pre-save hook to hash passwords before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is new/changed
  this.password = await bcrypt.hash(this.password, 10); // Hash with bcrypt
  next();
});

export default mongoose.model('User', userSchema);
