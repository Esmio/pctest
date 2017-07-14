export function getFirstDIgitFromInteger(integer) {
  const integerAsString = String(integer);
  if (integerAsString.length > 1) {
    const firstDigit = String(integer).charAt(0);
    return Number(firstDigit);
  }
  return 0;    
}
