const calculateProgressColor = (
  totalValid: number,
  grandTotal: number,
  successColor: string,
  errorColor: string
) => {
  const progress = (totalValid / grandTotal) * 100;
  const color = `linear-gradient(to right, ${successColor} ${progress}%, ${errorColor} ${progress}%)`;
  return { progress, color };
};

export default calculateProgressColor;
// This function calculates the progress color based on the number of valid items and the total number of items.
// It returns an object containing the progress percentage and a CSS linear gradient color string.
