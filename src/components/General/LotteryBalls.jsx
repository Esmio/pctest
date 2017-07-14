import React, { Component } from 'react';
import _ from 'lodash';
import PropsType from 'prop-types';
import { getDXDS, getMarkSixColor } from '../../utils';
import { Dice, PokerCard } from '../General';

class LotteryBalls extends Component {
  render() {
    const {
      diceSize,
      gameId,
      numsClassName,
      numsContainerClassName,
      numsDividerClassName,
      openCode,
      pokerSize,
      splitStringWith,
    } = this.props;
    if (!openCode) {
      console.warn('${openCode} 注号不能为空');
      return null;
    }
    const strArray = _.split(openCode, splitStringWith);
    const numsArray = _.map(strArray, num => _.toNumber(num));
    let newArray = [...numsArray];
    const sum = _.sum(numsArray);
    const lastNum = strArray[strArray.length - 1];
    const secondLastNum = strArray[strArray.length - 2];
    const lastTwoNumStr = (
      <span className={numsDividerClassName} key='divider_sscLast2Num'>
        { getDXDS(secondLastNum, false) } | { getDXDS(lastNum, false) }
      </span>
    );
    switch (gameId) {
      case 'HF_AHK3':
      case 'HF_GXK3':
        newArray = _.map(newArray, (drawNo, index) => {
          return (
            <span key={`${drawNo}__${index}`}>
              <Dice diceNum={drawNo} size={diceSize} />
            </span>
          );
        });
        newArray.push(
          <span className={numsDividerClassName} key='divider_Sum'>
            和值 = { sum }
          </span>
        );
        break;
      case 'HF_BJ28':
      case 'HF_LF28':
        newArray = [
          <span className={numsClassName} key='num1'>{strArray[0]}</span>,
          <span className={numsDividerClassName} key='divider_+1'>+</span>,
          <span className={numsClassName} key='num2'>{strArray[1]}</span>,
          <span className={numsDividerClassName} key='divider_+2'>+</span>,
          <span className={numsClassName} key='num3'>{strArray[2]}</span>,
          <span className={numsDividerClassName} key='divider_='>=</span>,
          <span className={numsClassName} key='sum'>{sum}</span>,
          <span className={numsDividerClassName} key='divider_Sum'>
            { getDXDS(sum, true) }
          </span>
        ];
        break;
      case 'MARK_SIX':
        newArray = _.map(strArray, (drawNo, index) => {
          return (
            <span
              data-color={getMarkSixColor(drawNo)}
              className={numsClassName}
              key={`${drawNo}__${index}`}
            >
              { drawNo }
            </span>
          );
        });
        _.fill(
          newArray,
          <span className={numsDividerClassName} key='divider_+'>+</span>,
          newArray.length - 1,
          newArray.length
        );
        newArray.push(
          <span
            data-color={getMarkSixColor(lastNum)}
            className={numsClassName}
            key={`${lastNum}__lastNum`}
          >
            { lastNum }
          </span>
        );
        break;
      case 'HF_KLPK':
      case 'HF_LFKLPK':
        newArray = _.map(newArray, (drawNo, index) => {
          return (
            <span key={`${drawNo}__${index}`}>
              <PokerCard pokerCode={[drawNo]} size={pokerSize} />
            </span>
          );
        });
        break;
      default:
        newArray = _.map(strArray, (drawNo, index) => {
          return (
            <span
              className={numsClassName}
              key={`${drawNo}__${index}`}
            >
              { drawNo }
            </span>
          );
        });
        if (/SSC/.test(gameId)) {
          newArray.push(lastTwoNumStr);
        }
    }
    return (
      <div className={numsContainerClassName}>
        { newArray }
      </div>
    );
  }
}

LotteryBalls.defaultProps = {
  splitStringWith: ','
};

LotteryBalls.propTypes = {
  diceSize: PropsType.string,
  gameId: PropsType.string.isRequired,
  numsClassName: PropsType.string,
  numsContainerClassName: PropsType.string,
  numsDividerClassName: PropsType.string,
  openCode: PropsType.string.isRequired,
  pokerSize: PropsType.number,
  splitStringWith: PropsType.string,
};

export default { LotteryBalls };
