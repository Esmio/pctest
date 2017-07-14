export function getDisplayName(singleGameName, subGroupName) {
  return subGroupName === '普通' ? singleGameName : `${singleGameName}-${subGroupName}`;
}
