import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgressBar from './CircularProgressbar';
import styles from './style.less';
// Generic Countdown Timer UI component
//
// https://github.com/uken/react-countdown-timer
//
// props:
//   - initialTimeRemain: Number
//       The time remaining for the countdown (in ms).
//
//   - interval: Number (optional -- default: 1000ms)
//       The time between timer ticks (in ms).
//
//   - formatFunc(initialTimeRemain): Function (optional)
//       A function that formats the initialTimeRemain.
//
//   - tickCallback(initialTimeRemain): Function (optional)
//       A function to call each tick.
//
//   - completeCallback(): Function (optional)
//       A function to call when the countdown completes.
//
class CountDownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialTimeRemain: this.props.initialTimeRemain,
      timeoutId: null,
      thisTimeRemain: 0
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
  
  getFormattedTime(thisTimeRemain) {
    if (this.props.formatFunc) {
      return this.props.formatFunc(thisTimeRemain);
    }

    let seconds = parseInt(thisTimeRemain % 60, 10);
    let minutes = parseInt(thisTimeRemain / 60, 10) % 60;
    let hours = parseInt(thisTimeRemain / 3600, 10);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    return { hours, minutes, seconds };
  }
  startInterval() {
    const intervalId = setInterval(this.tick, 1000);
    this.setState({ intervalId });
  }
  clearInterval() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }
  tick() {
    const { thisTimeRemain } = this.state;
    const newOpenTimeRemain = thisTimeRemain - 1;
    // console.log('购彩', newOpenTimeRemain);
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
    const { thisTimeRemain } = this.state;
    const currentTimePiece = this.getFormattedTime(thisTimeRemain);
    const hours = parseInt(thisTimeRemain / 3600, 10);
    const minutes = parseInt(thisTimeRemain / 60, 10) % 60;
    const seconds = parseInt(thisTimeRemain % 60, 10);
    return (
      <div className={styles.countDownContainer}>
        <span className={styles.circle}>
          <CircularProgressBar
            percentage={(hours / 24) * 100}
            textForPercentage={() => (`${currentTimePiece.hours}`)}
          />
        </span>
        <span className={styles.comma}>:</span>
        <span className={styles.circle}>
          <CircularProgressBar
            percentage={(minutes / 60) * 100}
            textForPercentage={() => (`${currentTimePiece.minutes}`)}
          />
        </span>
        <span className={styles.comma}>:</span>
        <span className={styles.circle}>
          <CircularProgressBar
            percentage={(seconds / 60) * 100}
            textForPercentage={() => (`${currentTimePiece.seconds}`)}
            strokeWidth={10}
          />
        </span>
      </div>
    );
  }
}

CountDownTimer.propTypes = {
  initialTimeRemain: PropTypes.number.isRequired,
  interval: PropTypes.number,
  formatFunc: PropTypes.func,
  tickCallback: PropTypes.func,
  completeCallback: PropTypes.func
};

export default CountDownTimer;
