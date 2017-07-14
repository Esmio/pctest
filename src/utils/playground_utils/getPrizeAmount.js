export function getPrizeAmount({ prizeName, prizeSettings }) {
  const prizeInfos = 
    _.find(prizeSettings, { prizeNameForDisplay: prizeName }) || 
    prizeSettings[0];
  return prizeInfos.prizeAmount;
}
