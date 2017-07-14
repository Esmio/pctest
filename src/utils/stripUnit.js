export function stripUnit(number) {
  if (typeof number === 'string' || typeof number === 'number') {
    return parseFloat(number, 10);
  }
  return NaN;
}
