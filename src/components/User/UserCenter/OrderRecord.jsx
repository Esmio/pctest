import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Pagination, Dropdown, Tooltip } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import { MDIcon, LoadingBar, PokerCard } from '../../General';
import { addCommas, type as TYPE, getConcatArray } from '../../../utils';
import css from '../styles/ProfileIndex.less';
import { accentCinnabar, accentTeal } from '../../../styles/variables.less';

const { transactionStateRefs, dateFormat } = TYPE;

const ellipsis = {
  width: '20%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  sorting: '',
  sortingTarget: ''
};

class OrderRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: [],
      tooltipText: '点我复制到剪贴板'
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.onCopySuccess = this.onCopySuccess.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onToolTipVisibleChange = this.onToolTipVisibleChange.bind(this);
    this.renderBetString = this.renderBetString.bind(this);
    this.onPopUpClose = this.onPopUpClose.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'orderModel/getOrderHistory' });
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
    if (nextProps.state !== this.props.state) {
      this.dispatch({
        type: 'orderModel/initializeState',
        payload: ['orderInfo', 'subOrders']
      });
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'dataTableModel/initializeState',
      payload: ['pageSize', 'currentPage', 'state']
    });
    this.dispatch({
      type: 'orderModel/initializeState',
      payload: ['orderInfo', 'subOrders']
    });
  }
  onTransactionSelect(transactionTimeuuid) {
    this.dispatch({ type: 'orderModel/updateState', payload: { transactionTimeuuid } });
    this.dispatch({ type: 'orderModel/getOrderDetails' });
  }
  onPopUpClose() {
    this.dispatch({
      type: 'orderModel/initializeState',
      payload: ['orderInfo', 'subOrders']
    });
  }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'dataTableModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'orderModel/getOrderHistory' });    
  }
  onPageChange(currentPage) {
    const { orderHistory, pageSize } = this.props;
    const lastPage = Math.round(orderHistory.length / pageSize);
    this.dispatch({ type: 'dataTableModel/updateState', payload: { currentPage } });
    if (currentPage >= lastPage) {
      this.dispatch({ type: 'orderModel/getOrderHistory' });
    }
  }
  onStateChange(state) {
    this.dispatch({ type: 'dataTableModel/updateState', payload: { currentPage: 1 } });
    this.dispatch({ type: 'orderModel/updateState', payload: { state } });
    this.dispatch({ type: 'orderModel/getOrderHistory' });    
  }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onSortChange({ direction, target }) {
    const { sorting, sortingTarget } = this.state;
    if (sorting === direction && sortingTarget === target) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction, sortingTarget: target }); 
    }
    this.dispatch({ type: 'orderModel/getOrderHistory' });
  }
  sliceList({ orderHistory, pageSize, currentPage }) {
    const { sorting, sortingTarget } = this.state;
    let currentList = [...orderHistory];
    if (orderHistory) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], [sortingTarget]);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], [sortingTarget]));
      }
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      currentList = _.slice([...currentList], start, end);
      this.setState({ currentList });
    }
  }
  renderTableBody() {
    const { currentList } = this.state;
    if (currentList.length) {
      return _.map(currentList, (listItem) => {
        const {
          transactionTimeuuid, gameNameInChinese, gameIssueNo,
          transactionAmount, rebate, bettingTime, transactionState,
          totalUnits, winAmount
        } = listItem;
        let amountColor = '';
        if (transactionState === 'WIN') {
          amountColor = accentTeal;
        } else if (transactionState === 'LOSS') {
          amountColor = accentCinnabar;          
        }
        return (
          <tr key={transactionTimeuuid}>
            <td>{ moment(bettingTime).format(dateFormat) }</td>
            <td>
              <a
                onClick={this.onTransactionSelect.bind(this, transactionTimeuuid)}
                className={css.profile_tableAnchor}
              >
                { gameNameInChinese }
              </a>
            </td>
            <td>{ gameIssueNo }</td>
            <td data-align="right">{ totalUnits }</td>
            <td data-align="right">{ rebate ? `${addCommas(rebate.toFixed(2))}元` : '-' }</td>
            <td data-align="right">{ addCommas(transactionAmount) }元</td>
            <td style={{ color: amountColor }} data-align="right">
              { transactionStateRefs[transactionState] }
              { transactionState === 'WIN' ? ` ${addCommas(winAmount.toFixed(2))}元` : ''}
            </td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan="7">暂无数据</td>
      </tr>
    );
  }
  renderPagination() {
    const { orderHistory, currentPage, pageSize } = this.props;
    const totalLength = orderHistory.length || 0;
    return (
      <Pagination
        defaultCurrent={currentPage}
        defaultPageSize={pageSize}
        onChange={this.onPageChange}
        onShowSizeChange={this.onPageSizeChange}
        showQuickJumper
        showSizeChanger
        total={totalLength}
      />
    );
  }
  renderStateDropdown() {
    const { state } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(transactionStateRefs, (typeValue, typeKey) => {
            return (
              <button
                data-active={typeKey === state}
                onClick={this.onStateChange.bind(this, typeKey)}
                key={typeKey}
                className={css.profile_dropdownMenuItem}
              >{ typeValue }</button>
            );
          })
        }
      </ul>
    );
  }
  renderBetString(perBetUnits) {
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(perBetUnits, (betStrings, index) => {
            const { betString, bonus } = betStrings;
            return (
              <li
                key={`${betString}-${index}`}
                className={css.profile_dropdownMenuItem}
              >
                <span>{ betString }</span>
                {
                  bonus ?
                  <span style={{ color: accentTeal, marginLeft: '0.5rem' }}>
                    { `中奖 ${addCommas(bonus)}元` }
                  </span> : null
                }
              </li>
            );
          })
        }
      </ul>
    );
  }
  renderSubOrder() {
    const { subOrders } = this.props;
    if (subOrders) {
      return _.map(subOrders, (order, index) => {
        const {
          gameMethodInChinese, transactionState, perBetUnits,
          perBetUnit, bettingAmount, totalUnits, winningAmount,
          betString
        } = order;
        const truncatedBetString = _.truncate(betString, {
          length: '24'
        });
        let amountColor = '';
        if (transactionState === 'WIN') {
          amountColor = accentTeal;
        } else if (transactionState === 'LOSS') {
          amountColor = accentCinnabar;          
        }
        return (
          <tr key={`${betString}-${index}`}>
            <td>{ gameMethodInChinese }</td>
            <td >
              <Dropdown
                trigger={['click']}
                overlay={this.renderBetString(perBetUnits)}
              >
                <a className={css.profile_tableAnchor}>{truncatedBetString}</a> 
              </Dropdown>
            </td>
            <td data-align="right">{ addCommas(perBetUnit) }元</td>
            <td data-align="right">{ totalUnits }</td>
            <td data-align="right">{ bettingAmount }</td>
            <td style={{ color: amountColor }} data-align="right">
              { transactionStateRefs[transactionState] }
              { winningAmount ? ` ${addCommas(winningAmount.toFixed(2))}元` : ''}
            </td>
          </tr>
        );
      });
    } return <tr><td colSpan="6">暂无数据</td></tr>;
  }
  renderOpenNo() {
    const { orderInfo } = this.props;
    const { gameUniqueId, drawNumber } = orderInfo;
    if (!drawNumber) {
      return <em className={css.profile_popUpOpenNo}>未开奖</em>;
    } else {
      let drawArray = _.split(drawNumber, '|');
      drawArray = _.map(drawArray, drawNo => _.toNumber(drawNo));
      const drawArraySum = _.sum(drawArray);
      switch (gameUniqueId) {
        case 'HF_BJ28':
        case 'HF_LF28':
          return (
            <em className={css.profile_popUpOpenNo}>
              {`${drawArray[0]} + ${drawArray[1]} + ${drawArray[2]} = ${drawArraySum}`}
            </em>      
          );
        case 'HF_KLPK':
        case 'HF_LFKLPK':
          drawArray = _.map(drawArray, drawNo => (
            <span key={drawNo}><PokerCard pokerCode={[drawNo]} /></span>
          ));
          return drawArray;
        default:
          return <em className={css.profile_popUpOpenNo}>{drawNumber}</em>;
      }
    }
  }
  renderTablePopUp() {
    const { orderInfo, allGameInfos } = this.props;
    if (orderInfo) {
      const {
        gameNameInChinese, gameUniqueId, transactionTimeuuid,
        transactionAmount, gameIssueNo, rebate, winningAmount,
        bettingTime, transactionState
      } = orderInfo;
      let amountColor = '';
      if (transactionState === 'WIN') {
        amountColor = accentTeal;
      } else if (transactionState === 'LOSS') {
        amountColor = accentCinnabar;          
      }
      const stringArry = getConcatArray(transactionTimeuuid);
      const { gameIconUrl } = _.find(allGameInfos, ['gameUniqueId', gameUniqueId]);
      return (
        <div className={css.profile_tablePopUp}>
          <div className={css.profile_popUpHeader}>
            <img
              className={css.profile_tablePopUpGamePic}
              src={gameIconUrl} alt={gameNameInChinese}
            />
            <h4 className={css.profile_popUpHeadline}>
              { gameNameInChinese }<br />
            </h4>
            <p className={css.profile_popUpSubHeadline}>
              第<strong>{gameIssueNo}</strong>期开奖号
              { this.renderOpenNo() }
            </p>
          </div>
          <div className={css.profile_popUpBody}>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>投注金额</h5>
              <p className={css.profile_popUpInfoContent}>{addCommas(transactionAmount)}元</p>
            </div>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>期号</h5>
              <p className={css.profile_popUpInfoContent}>{gameIssueNo}</p>
            </div>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>状态</h5>
              <p className={css.profile_popUpInfoContent} style={{ color: amountColor }}>
                {transactionStateRefs[transactionState]}
                { winningAmount ? ` ${addCommas(winningAmount)}元` : ''}
              </p>
            </div>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>下注时间</h5>
              <p className={css.profile_popUpInfoContent}>{ bettingTime }</p>
            </div>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={transactionTimeuuid}
                className={css.profile_popUpInlineInfo}
              >
                <Tooltip
                  title={this.state.tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                  <h5 className={css.profile_popUpInfoLabel}>注单号</h5>
                  <p className={css.profile_popUpInfoContent}>
                    <a className={css.profile_tableAnchor}>
                      <i>{stringArry[0]}</i>
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <i>{stringArry[1]}</i>
                    </a>
                  </p>
                </Tooltip>
              </ClipboardButton>
            <div className={css.profile_popUpInlineInfo}>
              <h5 className={css.profile_popUpInfoLabel}>返水</h5>
              <p className={css.profile_popUpInfoContent}>
                { rebate ? `${addCommas(rebate.toFixed(2))}元` : '-' }
              </p>
            </div>
          </div>
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td>游戏玩法</td>
                <td style={ellipsis}>下注号码</td>
                <td data-align="right">单注金额</td>
                <td data-align="right">注数</td>
                <td data-align="right">投注额</td>
                <td data-align="right">
                  { transactionStateRefs[transactionState] }
                  { winningAmount ? ` ${addCommas(winningAmount)}元` : ''}
                </td>
              </tr>
            </thead>
            <tbody>
              { this.renderSubOrder() }
            </tbody>
          </table>
        </div>
      );
    } return null;
  }
  renderFormLabel() {
    const { orderInfo } = this.props;
    if (orderInfo) {
      const { gameNameInChinese, gameIssueNo } = orderInfo;
      return (
        <h4 className={css.profile_formLabel}>
          <a
            onClick={this.onPopUpClose}
            className={css.profile_breadcrumItem__main}
          >
            <MDIcon iconName="keyboard-backspace" />
            <i>返回投注记录</i>
          </a>
          <span disabled className={css.profile_breadcrumItem}>
            <MDIcon iconName="chevron-right" />
            <i>
              <strong>{ gameNameInChinese }</strong> 第{ gameIssueNo }期详情
            </i>
          </span>
        </h4>
      );
    }
    return (
      <h4 className={css.profile_formLabel}>
        <span disabled className={css.profile_breadcrumItem__main}>
          投注记录
        </span>
      </h4>
    );
  }
  render() {
    const { sorting, sortingTarget } = this.state;
    const { state, awaitingResponse } = this.props; 
    return (
      <div>
        <div className={css.profile_contentBody} style={{ minHeight: '30rem' }}>
          { this.renderFormLabel() }
          <LoadingBar isLoading={awaitingResponse} />
          <div className={css.profile_popUpBody}>
            { this.renderTablePopUp() }
            <table className={css.profile_table}>
              <thead>
                <tr>
                  <td>投注时间</td>
                  <td>彩种</td>
                  <td>期号</td>
                  <td data-align="right">注数</td>
                  <td data-align="right">返水</td>
                  <td data-align="right">
                    <i style={{ marginRight: '0.5rem' }}>投注总额</i>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'up', target: 'transactionAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-up"
                        className={
                          (sorting === 'up' && sortingTarget === 'transactionAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }  
                      />
                    </button>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'down', target: 'transactionAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-down"
                        className={
                          (sorting === 'down' && sortingTarget === 'transactionAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }                    
                      />
                    </button>
                  </td>
                  <td data-align="right">
                    <Dropdown overlay={this.renderStateDropdown()}>
                      <button>
                        <i>
                          {state === 'ALL' ? '开奖状态' : transactionStateRefs[state]}
                        </i>
                        <MDIcon 
                          iconName="menu-down"
                          className={css.profile_tableMenuDownIcon}
                        />
                      </button>
                    </Dropdown>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'up', target: 'winAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-up"
                        className={
                          (sorting === 'up' && sortingTarget === 'winAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }  
                      />
                    </button>
                    <button
                      onClick={
                        this.onSortChange.bind(this, {
                          direction: 'down', target: 'winAmount'
                        })
                      }
                    >
                      <MDIcon
                        iconName="arrow-down"
                        className={
                          (sorting === 'down' && sortingTarget === 'winAmount') ?
                          css.profile_tableSortIcon__active : css.profile_tableSortIcon
                        }                    
                      />
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody>
                { this.renderTableBody() }
              </tbody>
            </table>
          </div>
        </div>
        { this.renderPagination() }
      </div>
    );
  }
}

const mapStatesToProps = ({ dataTableModel, gameInfosModel, orderModel }) => {
  const { gameInfosHot, gameInfosRecommend } = gameInfosModel;
  const allGameInfos = [...gameInfosHot, ...gameInfosRecommend];
  return { ...orderModel, ...dataTableModel, allGameInfos };
};

export default connect(mapStatesToProps)(OrderRecord);
