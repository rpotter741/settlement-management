const diceRoll = (dice, times) => {
  let result = 0;
  for (let i = 0; i < times; i++) {
    result += Math.floor(Math.random() * dice) + 1;
  }
  return result;
}

export default diceRoll;
