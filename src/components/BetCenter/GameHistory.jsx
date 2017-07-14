import React, { Component } from 'react';
import { Link } from 'dva/router';
import { MDIcon, LotteryBalls } from '../../components/General';
import css from './styles/GameHistory.less';

class GameHistory extends Component { 
  constructor(props, context) {
    super(props, context);
    this.state = {
      collapse: false,
    };
    this.dispatch = this.props.dispatch;
    this.onCollapseClick = this.onCollapseClick.bind(this);
    this.getThisGameHistory = this.props.getThisGameHistory;
    this.onShowMoreClick = this.props.onShowMoreClick;
    this.onRefreshClick = this.props.onRefreshClick;
  }
  onCollapseClick() {
    const { collapse } = this.state;
    if (collapse) {
      this.dispatch({ type: 'gameInfosModel/getThisGameHistory' });
    }
    this.setState({ collapse: !collapse });
  }
  renderOpenCode({ openCode }) {
    const { thisGameId } = this.props;
    if (openCode) {
      const lotteryBallsProps = {
        diceSize: '1rem',
        gameId: thisGameId,
        numsClassName: css.gameHistory_openCode,
        numsContainerClassName: css.gameHistory_openCodes,
        numsDividerClassName: css.gameHistory_openCodeDivider,
        openCode,
        pokerSize: 0.75
      };
      return <LotteryBalls {...lotteryBallsProps} />;
    } return null;
  }
  renderTableBody() {
    const { thisGameHistory } = this.props;
    if (thisGameHistory && thisGameHistory.length) {
      return _.map(thisGameHistory, (listItem) => {
        const { uniqueIssueNumber, officialOpenTime } = listItem;
        return (
          <div
            className={css.gameHistory_tableBodyRow}
            key={`${officialOpenTime}__${uniqueIssueNumber}`}
          >
            <div className={css.gameHistory_tableCell}>
              <span>{ uniqueIssueNumber }</span>
            </div>
            <div className={css.gameHistory_tableCell}>
              { this.renderOpenCode(listItem) }
            </div>
          </div>
        );
      });
    }
    return (
      <div className={css.gameHistory_tableBodyRow}>
        <div className={css.gameHistory_tableCell}>
          暂无数据
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className={css.gameHistory}>
        <div className={css.gameHistory_tableHeaderRow}>
          <div className={css.gameHistory_tableCell}>
            期号
          </div>
          <div className={css.gameHistory_tableCell}>
            开奖号
          </div>
        </div>
        <div
          className={css.gameHistory_body}
          data-collapse={this.state.collapse}
        >
          { this.renderTableBody() }
        </div>
        <div className={css.gameHistory_tableFooterRow}>
          <div className={css.gameHistory_tableCell}>
            <button
              onClick={this.onRefreshClick}          
              className={css.gameHistory_tableFooterBtn}
            >
              <MDIcon iconName="refresh" /><i>刷新</i>
            </button>
          </div>
          <div className={css.gameHistory_tableCell}>
            <button 
              onClick={this.onCollapseClick}
              className={css.gameHistory_tableFooterBtn}
              data-collapse={this.state.collapse}             
            >
              <MDIcon
                iconName={this.state.collapse ? 'chevron-double-down' : 'chevron-double-up'}
              />
            </button>                
          </div>
          <div className={css.gameHistory_tableCell}>
            <Link
              target="_blank"
              to={`/history?gameUniqueId=${this.props.thisGameId}`}
              className={css.gameHistory_tableFooterBtn}
            >
              <MDIcon iconName="open-in-new" /><i>更多</i>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

GameHistory.propTypes = {

};

export default GameHistory;
