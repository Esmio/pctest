import React, { Component } from 'react';
import moment from 'moment';
import { Pagination, Tooltip, Dropdown } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import _ from 'lodash';
import { connect } from 'dva';
import { addCommas, type as TYPE, getConcatArray } from '../../../utils';
import { MDIcon, LoadingBar } from '../../General';
import { accentTeal } from '../../../styles/variables.less';
import css from '../styles/ProfileIndex.less';

const { transferStateRefs, transferTypeRefs, transferSubTypeRefs, dateFormat } = TYPE;

class TopupRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: [],
      tooltipText: '点我复制到剪贴板',
      sorting: '',
      searchText: ''
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.onCopySuccess = this.onCopySuccess.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onToolTipVisibleChange = this.onToolTipVisibleChange.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'transactionModel/updateState', payload: { type: 'TOPUP' } });    
    this.dispatch({ type: 'transactionModel/getTransactionHistory' });
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'transactionModel/initializeState',
      payload: ['type', 'subType', 'state', 'transactionHistory']
    });
    this.dispatch({
      type: 'dataTableModel/initializeState',
      payload: ['pageSize', 'start', 'currentPage']
    });
  }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'dataTableModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'transactionModel/getTransactionHistory' });    
  }
  onPageChange(currentPage) {
    const { transactionHistory, pageSize } = this.props;
    const lastPage = Math.round(transactionHistory.length / pageSize);
    this.dispatch({ type: 'dataTableModel/updateState', payload: { currentPage } });
    if (currentPage >= lastPage) {
      this.dispatch({ type: 'transactionModel/getTransactionHistory' });
    }
  }
  onSubTypeChange(subType) {
    this.dispatch({ type: 'dataTableModel/updateState', payload: { currentPage: 1 } });
    this.dispatch({ type: 'transactionModel/updateState', payload: { subType } });
    this.dispatch({ type: 'transactionModel/getTransactionHistory' });    
  }
  onStateChange(state) {
    this.dispatch({ type: 'transactionModel/updateState', payload: { state } });
    this.dispatch({ type: 'dataTableModel/updateState', payload: { currentPage: 1 } });
    
    this.dispatch({ type: 'transactionModel/getTransactionHistory' });    
  }
  onSortChange(direction) {
    const { sorting } = this.state;
    if (sorting === direction) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction }); 
    }
    this.dispatch({ type: 'transactionModel/getTransactionHistory' });
  }
  sliceList({ transactionHistory, pageSize, currentPage }) {
    const { sorting, searchText } = this.state;
    let currentList = [...transactionHistory];
    if (transactionHistory) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], ['effectiveAmount']);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], ['effectiveAmount']));
      }
      if (searchText) {
        currentList = _.reduce(currentList, (newList, listItem) => {
          const { transactionId } = listItem;
          if (transactionId.indexOf(searchText) >= 0) {
            newList.push(listItem);
          }
          return newList;
        }, []);
      }
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      currentList = _.slice([...currentList], start, end);
      this.setState({ currentList });
    }
  }
  renderPagination() {
    const { transactionHistory, currentPage, pageSize } = this.props;
    const totalLength = transactionHistory.length;
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
  renderTableBody() {
    const { currentList } = this.state;
    if (currentList.length) {
      return _.map(currentList, (listItem) => {
        const {
          createTime, transactionId, type, state, effectiveAmount
        } = listItem;
        const isCompleted = state === 'COMPLETED';
        const stringArry = getConcatArray(transactionId);
        return (
          <tr key={transactionId}>
            <td>{ moment(createTime).format(dateFormat)}</td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={transactionId}
              >
                <Tooltip
                  title={this.state.tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                  <a className={css.profile_tableAnchor}>
                    <i>{stringArry[0]}</i>
                    <MDIcon iconName="multiplication" />
                    <MDIcon iconName="multiplication" />
                    <MDIcon iconName="multiplication" />
                    <MDIcon iconName="multiplication" />
                    <i>{stringArry[1]}</i>
                  </a>
                </Tooltip>
              </ClipboardButton>
            </td>
            <td>{ transferTypeRefs[type] }</td>
            <td>{ transferStateRefs[state] }</td>
            <td style={{ color: isCompleted ? accentTeal : '' }} data-align="right">
              {isCompleted ? '+' : ''}{ addCommas(effectiveAmount) }元
            </td>
          </tr>
        );
      });
    }
    return (<tr><td colSpan="6">暂无数据</td></tr>);
  }
  renderSubTypeDropdown() {
    const { subType } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(transferSubTypeRefs, (typeValue, typeKey) => {
            const isUnrelated = 
              typeKey.indexOf('WITHDRAWAL') > -1 ||
              typeKey.indexOf('UNRECOGNIZED') > -1 ||
              typeKey.indexOf('BANK_TRANSFER') > -1;
            return (
              isUnrelated ? null :
              <button
                data-active={typeKey === subType}
                onClick={this.onSubTypeChange.bind(this, typeKey)}
                key={typeKey}
                className={css.profile_dropdownMenuItem}
              >{ typeValue }</button>
            );
          })
        }
      </ul>
    );
  }
  renderStateDropdown() {
    const { state } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(transferStateRefs, (typeValue, typeKey) => {
            const isRelated = 
              typeKey === 'ALL' ||
              typeKey === 'COMPLETED' ||
              typeKey === 'FAILED';
            if (isRelated) {
              return (
                <button
                  data-active={typeKey === state}
                  onClick={this.onStateChange.bind(this, typeKey)}
                  key={typeKey}
                  className={css.profile_dropdownMenuItem}
                >{ typeValue }</button>
              );
            }
          })
        }
      </ul>
    );
  }
  render() {
    const { sorting, searchText } = this.state;
    const { state, subType, awaitingResponse } = this.props;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>充值记录
            <LoadingBar isLoading={awaitingResponse} />
          </h4>
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td>交易时间</td>
                <td>
                  收支单号
                </td>
                <td>
                  交易类型
                </td>
                <td>
                  <Dropdown overlay={this.renderStateDropdown()}>
                    <button>
                      <i>
                        {state === 'ALL' ? '交易状态' : transferStateRefs[state]}
                      </i>
                      <MDIcon iconName="menu-down" className={css.profile_tableMenuDownIcon} />
                    </button>
                  </Dropdown>
                </td>
                <td data-align="right">
                  <i style={{ marginRight: '0.5rem' }}>交易金额</i>
                  <button onClick={this.onSortChange.bind(this, 'up')}>
                    <MDIcon
                      iconName="arrow-up"
                      className={
                        sorting === 'up' ?
                        css.profile_tableSortIcon__active : css.profile_tableSortIcon
                      }  
                    />
                  </button>
                  <button onClick={this.onSortChange.bind(this, 'down')}>
                    <MDIcon
                      iconName="arrow-down"
                      className={
                        sorting === 'down' ?
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
        { this.renderPagination() }
      </div>
    );
  }
}

const mapStatesToProps = ({ dataTableModel, transactionModel }) => {
  return { ...transactionModel, ...dataTableModel };
};

export default connect(mapStatesToProps)(TopupRecord);
