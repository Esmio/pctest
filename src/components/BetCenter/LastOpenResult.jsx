import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import { getDXDS, getMarkSixColor } from '../../utils';
import { EllipsisLoader, PokerCard, Dice, LotteryBalls } from '../General';
import css from './styles/GameHeader.less';

export default class LastOpenResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialTimeRemain: props.initialTimeRemain,
      thisTimeRemain: props.initialTimeRemain
    };
    this.tick = this.tick.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.clearInterval = this.clearInterval.bind(this);
  }
  componentDidMount() {
    this.startInterval();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initialTimeRemain !== this.state.initialTimeRemain) {
      this.clearInterval();
      this.setState({
        initialTimeRemain: nextProps.initialTimeRemain,
        thisTimeRemain: nextProps.initialTimeRemain
      });
      if (nextProps.initialTimeRemain >= 1) {
        this.startInterval();
      } else {
        this.setState({
          initialTimeRemain: 0,
          thisTimeRemain: 0
        });
      }
    }
  }
  componentWillUnmount() {
    this.clearInterval();
  }
  clearInterval() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }
  startInterval() {
    const intervalId = setInterval(this.tick, 1000);
    this.setState({ intervalId });
  }
  tick() {
    const { thisTimeRemain } = this.state;
    const newOpenTimeRemain = thisTimeRemain - 1;
    // console.log('开奖', newOpenTimeRemain);
    if (newOpenTimeRemain <= 0) {
      this.clearInterval();
      this.setState({
        initialTimeRemain: 0,
        thisTimeRemain: 0
      });
      this.props.completeCallback();
    } else {
      this.setState({ thisTimeRemain: newOpenTimeRemain });
    }
  }
  render() {
    const { lastOpen } = this.props;
    const { openStatus, openCode, uniqueIssueNumber } = lastOpen;
    if (openStatus) {
      const { thisGameId } = this.props;
      const lotteryBallsProps = {
        diceSize: '2rem',
        gameId: thisGameId,
        numsClassName: css.gameHeader_openNumber,
        numsContainerClassName: css.gameHeader_openNumbers,
        numsDividerClassName: css.gameHeader_openNumberDivider,
        openCode,
      };
      return (
        <div className={css.gameHeader_gameResult}>
          <p className={css.gameHeader_headerPhase}>
            第 <strong>{ uniqueIssueNumber }</strong> 期开奖号码
          </p>
          <LotteryBalls {...lotteryBallsProps} />
        </div>
      );
    }
    return (
      <div className={css.playground_gameResult}>
        <p className={css.playground_headerPhase__grayOut}>
          正等待第 <strong>{ uniqueIssueNumber }</strong> 期开奖
          <EllipsisLoader duration={this.state.openDuration || 3000} />
        </p>
      </div>
    );
  }
}

LastOpenResult.propTypes = {
  uniqueIssueNumber: PropTypes.number,
};
