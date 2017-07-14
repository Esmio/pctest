/**
 * Created by sean.junior-jx on 2017/5/27.
 * Modify by louis-jx on 2017/710.
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import css from '../../styles/history/historyIndex.less';
import { EllipsisLoader, LoadingBar, MDIcon, Button, LotteryBalls } from '../General';

class HistoryTable extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.awaitingResponse = false;
    this.onBackClick = this.onBackClick.bind(this);
    this.onSingleGameSelect = this.onSingleGameSelect.bind(this);
    this.onMoreClick = this.onMoreClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.awaitingResponse = nextProps.awaitingResponse;
  }
  onSingleGameSelect(thisGameId) {
    this.dispatch(
      routerRedux.push({
        pathname: '/history',
        query: {
          gameUniqueId: thisGameId,
        },
      })
    );
  }
  onMoreClick() {
    const { resultLimit } = this.props;
    this.dispatch({ type: 'betCenter/updateState', payload: { resultLimit: resultLimit + 20 } });
    this.dispatch({ type: 'gameInfosModel/getThisGameHistory' });
  }
  onBackClick() {
    this.dispatch({ type: 'betCenter/initializeState', payload: ['thisGameId', 'resultLimit'] });
    this.dispatch(routerRedux.replace({ pathname: '/history' }));
  }
  renderBreadcrum() {
    const { thisGameHistory, thisGameId } = this.props;
    if (thisGameHistory) {
      const historyObj = _.find(thisGameHistory, ['gameUniqueId', thisGameId]);
      const { gameNameInChinese } = historyObj;
      return (
        <h4>
          <button onClick={this.onBackClick} className={css.history_backBtn}>
            <MDIcon iconName='keyboard-backspace' />
            全部开奖
          </button>
          { gameNameInChinese }开奖历史
        </h4>
      );
    } 
    return (
      <h4>
        开奖历史
      </h4>
    );
  }
  renderTableBody() {
    const { allHistory, thisGameHistory } = this.props;
    const historyList = thisGameHistory || allHistory;

    if (historyList && historyList.length) {
      return _.map(historyList, (item) => {
        const {
          gameUniqueId, uniqueIssueNumber, openStatus,
          openCode, openTime, gameNameInChinese
        } = item;
        
        const tableRowProps = {
          className: css.history_tableRow,
          onClick: this.onSingleGameSelect.bind(this, gameUniqueId),
          disabled: thisGameHistory.length,
          key: `${gameUniqueId}__${uniqueIssueNumber}`
        };
        if (!openStatus) {
          return (
            <button {...tableRowProps}>
              <div className={css.history_tableCell}>{ gameNameInChinese }</div>
              <div className={css.history_tableCell}>第{ uniqueIssueNumber }期</div>
              <div className={css.history_tableCell}>
                正在开奖 <EllipsisLoader duration={3000} />
              </div>
              <div className={css.history_tableCell}>
                { moment(openTime).format('YYYY-MM-DD HH:mm:ss') }
              </div>
            </button>
          );
        }
        const lotteryBallsProps = {
          diceSize: '1.5rem',
          gameId: gameUniqueId,
          numsClassName: css.history_lotteryBall,
          numsContainerClassName: css.history_tableCell,
          numsDividerClassName: css.history_lotteryBallDivider,
          openCode,
          pokerSize: 0.75
        };
        return (
          <button {...tableRowProps}>
            <div className={css.history_tableCell}>{ gameNameInChinese }</div>
            <div className={css.history_tableCell}>第{ uniqueIssueNumber }期</div>
            { openCode && <LotteryBalls {...lotteryBallsProps} /> }
            <div className={css.history_tableCell}>
              { moment(openTime).format('YYYY-MM-DD HH:mm:ss') }
            </div>
          </button>
        );
      });
    }
    return (
      <div className={css.history_tableRow}>
        <div className={css.history_tableCell}>暂无数据</div>
      </div>
    );
  }
  render() {
    const { resultLimit, thisGameHistory } = this.props;
    return (
      <div className={css.history}>
        <div className={css.history_body}>
          { this.renderBreadcrum() }
          <LoadingBar isLoading={this.awaitingResponse} style={{ backgroundColor: '#fff' }} />
          <div className={css.history_table}>
            <div className={css.history_tableHead}>
              <div className={css.history_tableCell}>彩种</div>
              <div className={css.history_tableCell}>期号</div>
              <div className={css.history_tableCell}>开奖号码</div>
              <div className={css.history_tableCell}>开奖时间</div>
            </div>
            { this.renderTableBody() }
            { thisGameHistory &&
              <button
                className={css.history_tableRow}
                disabled={resultLimit >= 100}
                onClick={this.onMoreClick}
              >
                <div className={css.history_tableCell}>加载更多</div>
              </button>
            }
            { thisGameHistory &&
              <Button placeholder="全部开奖" onClick={this.onBackClick} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default HistoryTable;
