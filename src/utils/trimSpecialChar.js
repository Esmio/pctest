export function trimSpecialChar(str) {
  const newStr = str;
  return newStr.replace(/[&\\_+-.,!@#$%^&*();\\/|<>"']/g, '');
}
