export default class Vault {
  constructor(initialGold) {
    this.value = initialGold;
    this.transactions = []; // Tracks all inflows and outflows
  }

  // Add gold to the vault
  deposit(amount, source = 'unknown') {
    this.value += amount;
    this.transactions.push({ type: 'deposit', amount, source });
  }

  // Remove gold from the vault
  withdraw(amount, purpose = 'unknown') {
    if (amount > this.value) {
      console.warn('Insufficient funds');
      return false;
    }
    this.value -= amount;
    this.transactions.push({ type: 'withdrawal', amount, purpose });
    return true;
  }

  // Get current balance
  getBalance() {
    return this.value;
  }

  // Get transaction history
  getTransactions(filter = {}) {
    return this.transactions.filter((transaction) => {
      return Object.entries(filter).every(
        ([key, value]) => transaction[key] === value
      );
    });
  }
}
