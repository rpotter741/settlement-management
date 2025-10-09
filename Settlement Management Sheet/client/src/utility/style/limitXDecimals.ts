const limitXDecimals = (value: number, decimals: number): number => {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
};

export default limitXDecimals;
