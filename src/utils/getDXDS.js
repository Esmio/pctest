export function getDXDS(number, JZ) {
  let str = '';
  if (JZ) {
    if (number < 6) {
      return '极小';
    } else if (number > 21) {
      return '极大';
    }
  }

  if (JZ) {
    if (number > 13) {
      str += '大';
    } else {
      str += '小';
    }
  } else if (number > 4) {
      str += '大';
    } else {
      str += '小';
    }

  if ((parseInt(number, 10) + 2) % 2 === 0) {
    str += '双';
  } else {
    str += '单';
  }
  return str;
}
