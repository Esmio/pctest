export function getSettingKey(selectedNav, displayName) {
  const gameSettingNameArray = _.concat([], selectedNav, displayName);
  if (selectedNav !== displayName) {
    return _.join(gameSettingNameArray, '-');
  }
  return displayName;
}
