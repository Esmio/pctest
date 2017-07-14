function testStr(re, str) {
  let midstring;
  if (re.test(str)) {
    midstring = ' contains ';
  } else {
    midstring = ' does not contain ';
  }
  return str + midstring + re.source;
}

export { testStr };
