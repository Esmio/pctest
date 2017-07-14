export function getPrizePercentage(prize) {
  let percentage = prize - 1800;
  percentage /= 200;
  percentage *= 10;
  percentage = percentage.toFixed(1);
  return percentage;
}
