const addCommas = (nStr) => {
  const str = String(nStr);
  const x = str.split('.');
  let actualNumber = x[0];
  const afterDecimalNumber = x.length > 1 ? `.${x[1]}` : '';
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(actualNumber)) {
    actualNumber = actualNumber.replace(rgx, '$1' + ',' + '$2');
  }
  return actualNumber + afterDecimalNumber;
};

export { addCommas };
