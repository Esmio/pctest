import React, { Component } from 'react';
import { Link } from 'dva/router';
import { MDIcon } from '../General';
import CountDownTimer from './CountDownTimer/';
import LastOpenResult from './LastOpenResult';
import css from './styles/GameHeader.less';

class GameHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderTimeRemain: 0,
      openTimeRemain: 0
    };
    this.setTimeIsUp = this.props.setTimeIsUp;
    this.onCountDownFinish = this.props.onCountDownFinish;
    this.onRefreshClick = this.props.onRefreshClick;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.current) {
      this.setStopOrderTime(nextProps);
    } else {
      this.setState({ orderTimeRemain: 0 });
    }
    if (nextProps.lastOpen) {
      this.setOpenTime(nextProps);
    } else {
      this.setState({ openTimeRemain: 0 });
    }
  }
  setOpenTime({ lastOpen }) {
    const { officialOpenTimeEpoch, currentTimeEpoch } = lastOpen;
    const openTimeRemain = officialOpenTimeEpoch - currentTimeEpoch;
    
    this.setState({ openTimeRemain });
  }
  setStopOrderTime({ current }) {
    const { stopOrderTimeEpoch, currentTimeEpoch } = current;
    const orderTimeRemain = stopOrderTimeEpoch - currentTimeEpoch;
    this.setState({ orderTimeRemain });
  }
  render() {
    const {
      thisGameInfo, lastOpen, onCountDownFinish, current, thisGameId
    } = this.props;
    
    const { orderTimeRemain, openTimeRemain } = this.state;
    if (thisGameInfo) {
      const { gameNameInChinese, gameIconUrl } = thisGameInfo;
      const { uniqueIssueNumber } = current;
      const lastOpenProps = {
        thisGameId,
        dispatch: this.dispatch,
        uniqueIssueNumber,
        lastOpen,
        initialTimeRemain: openTimeRemain,
        completeCallback: this.onRefreshClick
      };
      const countDownProps = {
        initialTimeRemain: orderTimeRemain,
        completeCallback: onCountDownFinish
      };
      return (
        <div className={css.gameHeader}>
          <div className={css.gameHeader_infosRow}>
            <div className={css.gameHeader_infos}>
              <img
                className={css.gameIcon} src={gameIconUrl} alt={gameNameInChinese}
              />
              <div className={css.gameHeader_infosContent}>
                <p className={css.headerGameName}>{gameNameInChinese}</p>
                <p>
                  第 <strong>{ uniqueIssueNumber }</strong> 期
                </p>
                <div className={css.headerLinks}>
                  <Link
                    target="_blank"
                    to={`/trend?gameUniqueId=${this.props.thisGameId}`}
                    className={css.headerLink}
                  >
                    <MDIcon iconName="clipboard-text" />遗漏分析
                  </Link>
                  <Link
                    target="_blank"
                    to={`/history?gameUniqueId=${this.props.thisGameId}`}
                    className={css.headerLink}
                  >
                    <MDIcon iconName="history" />历史开奖
                  </Link>
                </div>
              </div>
            </div>
            <div className={css.gameHeader__LastOpenResult}>
              <LastOpenResult {...lastOpenProps} />
            </div>
            <div className={css.gameHeader_timer}>
              <p>剩余投注时间</p>
              <CountDownTimer {...countDownProps} />
            </div>
          </div>
        </div>
      );
    } return null;
  }
}

export default GameHeader;
