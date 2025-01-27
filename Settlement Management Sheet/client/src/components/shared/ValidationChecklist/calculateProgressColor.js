const calculateProgressColor = (
  totalValid,
  grandTotal,
  successColor,
  errorColor
) => {
  const progress = (totalValid / grandTotal) * 100;
  const color = `linear-gradient(to right, ${successColor} ${progress}%, ${errorColor} ${progress}%)`;
  return { progress, color };
};

export default calculateProgressColor;
