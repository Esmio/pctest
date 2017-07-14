export function isLastItem(array, index) {
  if (array.length && typeof index === 'number') {
    const isLast = index === array.length;
    return isLast;
  }
  throw new Error(`isLastItem() Expecting an array and number, but get ${typeof array} and ${typeof index} instead`);
}
