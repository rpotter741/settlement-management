import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true,
  }, // Type of transaction: deposit or withdrawal
  amount: { type: Number, required: true }, // Amount of gold
  source: { type: String, default: 'unknown' }, // Source of the deposit
  purpose: { type: String, default: 'unknown' }, // Purpose of the withdrawal
  date: { type: Date, default: Date.now }, // Timestamp of the transaction
});

const VaultSchema = new mongoose.Schema({
  value: { type: Number, required: true, default: 0 }, // Current vault balance
  transactions: { type: [TransactionSchema], default: [] }, // List of all transactions
});

// Create the model
const Vault = mongoose.model('Vault', VaultSchema);

export { Vault, VaultSchema };
