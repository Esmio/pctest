'use strict';
import _ from 'lodash';

const numberGenerators = (() => {
  let numbers = [];
  let leadingNums = [];
  function init() {
    numbers = [];
    leadingNums = [];
  }
  function create({ length, start = 0 }) {
    init();
    for (let num = start; num <= length; num++) {
      numbers.push(num);
    }
    return this;
  }
  function makeLeading(leadingPad = 2) {
    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      let leadingNum = number;
      if (number < 10) {
        leadingNum = _.padStart(`${number}`, leadingPad, '0');
      }
      leadingNums.push(leadingNum);
    }
    return this;
  }
  function get() {
    return [...numbers];
  }
  function getLeading() {
    if (numbers.length) {
      makeLeading();
    }
    return [...leadingNums];
  }

  return { create, get, getLeading };
})();

export { numberGenerators };
