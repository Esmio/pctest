import _ from 'lodash';
import { type } from '../utils/';
import { MathUtil } from './mathUtils';
import { ArrayUtil } from './arrayUtils';

const gameCalculation = (() => {
});

gameCalculation[type.SINGLE] = {
  init() { this.total = 0; },
  calculate({ picksLength }) {
    this.init.call(this);
    this.picksLength = picksLength;
    _.forEach(picksLength, (length) => {
      this.total += length;
    });
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.BUNDLING_THREE] = {
  init() { this.total = 0; },
  calculate({ picksLength, setIsFulFilled }) {
    this.init.call(this);
    this.picksLength = picksLength;
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, () => {
        this.total++;
      });
    }
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.SUM] = {
  init() {
    this.subTotal = 0;
    this.total = 0;
  },  
  calculate(
    { thisBetObj, valueRef, openOptionsOnGame, uniqueInt, setIsFulFilled }
  ) {
    this.init.call(this);
    this.openOptionsOnGame = openOptionsOnGame;
    this.thisBetObj = thisBetObj;
    this.setIsFulFilled = setIsFulFilled;
    this.uniqueInt = uniqueInt;
    this.valueRef = valueRef;
    if (this.setIsFulFilled) {
      _.forEach(this.thisBetObj, (picks) => {
        // console.debug(picks);
        const picksInValue = _.map(picks, (pick) => {
          if (_.isNumber(pick)) {
            return this.valueRef[pick];
          }
        });
        this.total = _.sum(picksInValue);
      });
    }
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.SUM__OPEN] = Object.assign({}, gameCalculation[type.SUM]);
gameCalculation[type.SUM__OPEN].getOpenOptionsTotal = function () {
  this.openOptionsLength = this.openOptionsOnGame.length || 0;
  this.total *=
    this.openOptionsLength === 0 ? 0 : 
    MathUtil.combination(this.openOptionsOnGame.length, this.uniqueInt);
  return this.total;
};

gameCalculation[type.DUPLEX] = {
  init() { this.total = 0; },
  calculate({ picksLength, setIsFulFilled }) {
    this.init.call(this);
    this.picksLength = picksLength;
    this.setIsFulFilled = setIsFulFilled;
    this.total = this.setIsFulFilled ? 1 : 0;
    _.forEach(this.picksLength, (length) => {
      this.total *= length;
    });
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.GROUP_3] = {
  init() { this.total = 0; },
  calculate({ picksLength, openOptionsOnGame, uniqueInt, setIsFulFilled }) {
    this.init.call(this);
    this.openOptionsOnGame = openOptionsOnGame;
    this.picksLength = picksLength;
    this.uniqueInt = uniqueInt;
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, (length) => {
        this.total += length * (length - 1);
      });
    }
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.GROUP_3__OPEN] = Object.assign({}, gameCalculation[type.GROUP_3]);
gameCalculation[type.GROUP_3__OPEN].getOpenOptionsTotal = function () {
  this.total *=
    !this.openOptionsOnGame.length ? 0 :
    MathUtil.combination(this.openOptionsOnGame.length, this.uniqueInt);
  return this.total;
};

gameCalculation[type.GROUP_6] = {
  init() { this.total = 0; },
  calculate({ picksLength, openOptionsOnGame, uniqueInt, setIsFulFilled }) {
    this.init.call(this);
    this.openOptionsOnGame = openOptionsOnGame;
    this.picksLength = picksLength;
    this.uniqueInt = uniqueInt;
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, (length) => {
        // console.debug('GROUP_6', length);
        this.total += (length * (length - 1) * (length - 2)) / 6;
      });
    }
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.GROUP_6__OPEN] = Object.assign({}, gameCalculation[type.GROUP_6]);
gameCalculation[type.GROUP_6__OPEN].getOpenOptionsTotal = function () {
  this.total *=
    !this.openOptionsOnGame.length ? 0 :
    MathUtil.combination(this.openOptionsOnGame.length, this.uniqueInt);
  return this.total;
};

gameCalculation[type.GROUP_2] = {
  init() { this.total = 0; },
  calculate({ picksLength, uniqueInt, openOptionsOnGame, setIsFulFilled }) {
    this.init.call(this);
    this.openOptionsOnGame = openOptionsOnGame;
    this.picksLength = picksLength;
    this.setIsFulFilled = setIsFulFilled;
    this.uniqueInt = uniqueInt;
    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, (length) => {
        // console.debug('GROUP_2', length, this.openOptionsOnGame);
        this.total += (length * (length - 1)) / this.uniqueInt;
      });
    }
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.GROUP_2__OPEN] = Object.assign({}, gameCalculation[type.GROUP_2]);
gameCalculation[type.GROUP_2__OPEN].getOpenOptionsTotal = function () {
  this.openOptionsLength = this.openOptionsOnGame.length || 0;
  this.total *= this.openOptionsLength === 0 ?
    0 : MathUtil.combination(this.openOptionsLength, this.uniqueInt);
  return this.total;
};

gameCalculation[type.GROUP_PICK_24] = {
  init() { this.total = 0; },
  calculate({ picksLength, openOptionsOnGame, uniqueInt, setIsFulFilled }) {
    this.init.call(this);
    this.openOptionsOnGame = openOptionsOnGame;
    this.openOptionsLength = this.openOptionsOnGame.length;
    this.picksLength = picksLength;
    this.setIsFulFilled = setIsFulFilled;
    this.uniqueInt = uniqueInt;
    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, (length) => {
        this.total += MathUtil.combination(length, this.uniqueInt);
      });
    }
    return this;
  },
  getTotal() {
    return this.total;
  }
};

gameCalculation[type.GROUP_PICK_24__OPEN] = Object.assign({}, gameCalculation[type.GROUP_PICK_24]);
gameCalculation[type.GROUP_PICK_24__OPEN].getOpenOptionsTotal = function () {
  this.total *= this.openOptionsLength === 0 ?
    0 : MathUtil.combination(this.openOptionsLength, this.uniqueInt);
  return this.total;
};

gameCalculation[type.GROUP_PICK_4] = {
  init() {
    this.total = 0;
  },
  calculate({
    thisBetObj, picksLength, pickRange, openOptionsOnGame, setIsFulFilled, uniqueInt
  }) {
    this.init.call(this);
    this.thisBetObj = thisBetObj;
    this.picksKeys = _.keys(thisBetObj);
    this.openOptionsOnGame = openOptionsOnGame;
    this.setIsFulFilled = setIsFulFilled;
    this.firstRowPicks = this.thisBetObj[this.picksKeys[0]];
    this.secondRowPicks = this.thisBetObj[this.picksKeys[1]];
    this.firstLength = picksLength[0];
    this.secondLength = picksLength[1];
    this.uniqueInt = uniqueInt;
    this.firstMin = _.split(pickRange[0], '-')[0];
    this.secondMin = _.split(pickRange[1], '-')[0];
    if (this.setIsFulFilled) {
      this.intersectLength = ArrayUtil.intersect(this.firstRowPicks, this.secondRowPicks).length;
      this.total = 
        MathUtil.combination(this.firstLength, this.firstMin) *
        MathUtil.combination(this.secondLength, this.secondMin);
    }
    return this;
  },
  getTotal() {
    if (this.intersectLength > 0) {
      this.total -= 
        MathUtil.combination(this.intersectLength, 1) * 
        MathUtil.combination(this.secondLength - 1, 1);
    }
    return this.total;
  }
};

gameCalculation[type.GROUP_PICK_4__OPEN] = Object.assign({}, gameCalculation[type.GROUP_PICK_4]);
gameCalculation[type.GROUP_PICK_4__OPEN].getOpenOptionsTotal = function () {
  if (this.intersectLength > 0) {
    this.total -= 
      MathUtil.combination(this.intersectLength, 1);
  }
  this.total *= 
    this.openOptionsOnGame.length === 0 ? 0 : 
    MathUtil.combination(this.openOptionsOnGame.length, this.uniqueInt);
  return this.total;
};

gameCalculation[type.GROUP_PICK_12] = Object.assign({}, gameCalculation[type.GROUP_PICK_4]);
gameCalculation[type.GROUP_PICK_12__OPEN] = Object.assign({}, gameCalculation[type.GROUP_PICK_12]);
gameCalculation[type.GROUP_PICK_12__OPEN].getOpenOptionsTotal = function () {
  if (this.intersectLength > 0) {
    this.total -= 
      MathUtil.combination(this.intersectLength, 1) * 
      MathUtil.combination(this.secondLength - 1, 1);
  }
  this.total *= 
    this.openOptionsOnGame.length === 0 ? 0 : 
    MathUtil.combination(this.openOptionsOnGame.length, this.uniqueInt);
  return this.total;
};

gameCalculation[type.DIRECT_COMBINE] = {
  init() { this.total = 0; },
  calculate({ picksLength, pickRange, setIsFulFilled }) {
    this.init.call(this);
    this.picksLength = picksLength;
    this.pickRange = pickRange;
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, (length, index) => {
        const minRange = _.split(this.pickRange[index], '-')[0];
        this.total += MathUtil.combination(length, minRange);
      });
    }
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.GROUP_PICK_6] = {
  init() { this.total = 0; },
  calculate({ picksLength, openOptionsOnGame, pickRange, uniqueInt }) {
    this.init.call(this);
    this.picksLength = picksLength;
    this.openOptionsOnGame = openOptionsOnGame;
    this.pickRange = pickRange;
    this.uniqueInt = uniqueInt;
    _.forEach(this.picksLength, (length, index) => {
      const minRange = _.split(this.pickRange[index], '-')[0];
      if (length) {
        this.total += MathUtil.combination(length, minRange);
      }
    });
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.GROUP_PICK_6__OPEN] = Object.assign({}, gameCalculation[type.GROUP_PICK_6]);
gameCalculation[type.GROUP_PICK_6__OPEN].getOpenOptionsTotal = function () {
  this.total *= 
    this.openOptionsOnGame.length === 0 ? 0 : 
    MathUtil.combination(this.openOptionsOnGame.length, this.uniqueInt);
  return this.total;
};

gameCalculation[type.COMBO_DUPLEX] = {
  init() {
    this.total = 0;
    this.subTotal = 0;
  },
  calculate({ picksLength, minimumRowPick }) {
    this.init.call(this);
    this.combinationArray = [];
    this.minimumRowPick = minimumRowPick;
    this.pickPosition = [];
    this.picksLength = picksLength;
    _.forEach(picksLength, (length, index) => {
      if (length > 0) {
        this.pickPosition.push(index);
      }
    });
    this.combinationArray = MathUtil.getCombination(this.pickPosition, this.minimumRowPick);

    _.forEach(this.combinationArray, (combos) => {
      const combo = _.split(combos, ',');

      this.subTotal = 1;
      _.forEach(combo, (integer) => {
        const index = Number(integer);
        this.subTotal *= this.picksLength[index];
        // console.debug(picksLength, index);
      });
      this.total += this.subTotal;
    });
    return this;
  },
  getTotal() { return this.total; }
};

gameCalculation[type.TOP_TWO_BET] = {
  init() { this.total = 0; },
  calculate({ thisBetObj, setIsFulFilled }) {
    this.init.call(this);
    this.pickKeys = _.keys(thisBetObj);
    this.firstRowPicks = thisBetObj[this.pickKeys[0]];
    this.secondRowPicks = thisBetObj[this.pickKeys[1]];
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      this.intersectLength = ArrayUtil.intersect(this.firstRowPicks, this.secondRowPicks).length;
      this.total = (this.firstRowPicks.length * this.secondRowPicks.length) - this.intersectLength;
    }
    return this;
  },
  getTotal() {
    return this.total;
  }
};

gameCalculation[type.TOP_THREE_BET] = {
  init() { this.total = 0; },
  calculate({ thisBetObj, setIsFulFilled }) {
    this.init.call(this);
    this.thisBetObj = thisBetObj;
    this.pickKeys = _.keys(this.thisBetObj);
    this.firstRowPicks = this.thisBetObj[this.pickKeys[0]];
    this.secondRowPicks = this.thisBetObj[this.pickKeys[1]];
    this.thirdRowPicks = this.thisBetObj[this.pickKeys[2]];
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      _.forEach(this.firstRowPicks, (firstRowNum) => {
        _.forEach(this.secondRowPicks, (secondRowNum) => {
          _.forEach(this.thirdRowPicks, (thirdRowNum) => {
            const conditionPassed = 
              firstRowNum !== secondRowNum &&
              firstRowNum !== thirdRowNum &&
              secondRowNum !== thirdRowNum;
            if (conditionPassed) {
              this.total++;
            }
          });
        });
      });
    }
    return this;
  },
  getTotal() {
    return this.total;
  }
};

gameCalculation[type.DIRECT_PICK_PULL_BET] = {
  init() { this.total = 0; },
  calculate({ picksLength, uniqueInt, setIsFulFilled }) {
    this.init.call(this);
    // console.debug(picksLength);
    this.picksLength = picksLength;
    this.firstLength = this.picksLength[0];
    this.secondLength = this.picksLength[1];
    this.uniqueInt = uniqueInt;
    this.setIsFulFilled = setIsFulFilled;
    if (this.setIsFulFilled) {
      this.total = MathUtil.combination(this.secondLength, this.uniqueInt - this.firstLength);
    }
    return this;
  },
  getTotal() {
    return this.total;
  }
};

gameCalculation[type.DIRECT_MULTIPLY] = {
  init() { this.total = 0; },
  calculate({ picksLength, uniqueInt, setIsFulFilled }) {
    this.init.call(this);
    this.picksLength = picksLength;
    this.uniqueInt = uniqueInt;
    this.setIsFulFilled = setIsFulFilled;

    if (this.setIsFulFilled) {
      _.forEach(this.picksLength, (length) => {
        this.total += length * this.uniqueInt;
      });
    }
    return this;
  },
  getTotal() {
    return this.total;
  }
};

export { gameCalculation };
