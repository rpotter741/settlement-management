function changeIconDimensions(dimString: string, value = 2) {
  return dimString
    .split(' ')
    .map((num) => Math.floor(Number(num) / value))
    .join(' ');
}
export default changeIconDimensions;
