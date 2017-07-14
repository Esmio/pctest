import React from 'react';
import classNames from 'classnames';
import icons from '../../styles/iconfont.less';
import css from '../../styles/general/dice.less';

export function Dice({
  diceNum, color, backgroundColor, size
}) {
  return (
    <span
      className={classNames(css.dice, icons[`DICE_${diceNum}`])}
      style={{ color, backgroundColor, fontSize: size }} data-num={diceNum}
    />
  );
}
