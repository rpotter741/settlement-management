export function isEven(num: number): boolean {
  return num % 2 === 0;
}
export function isOdd(num: number): boolean {
  return num % 2 !== 0;
}
export function isPositive(num: number): boolean {
  return num > 0;
}
export function isNegative(num: number): boolean {
  return num < 0;
}
export function isZero(num: number): boolean {
  return num === 0;
}
export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}
export function isFloat(num: number): boolean {
  return Number(num) === num && num % 1 !== 0;
}
export function isNaN(num: number): boolean {
  return Number.isNaN(num);
}
