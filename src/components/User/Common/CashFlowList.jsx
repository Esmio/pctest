import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Pagination, Tooltip, DatePicker, Dropdown } from 'antd';
import ClipboardButton from 'react-clipboard.js';
import { connect } from 'dva';
import { addCommas, type as TYPE, getConcatArray } from '../../../utils';
import { MDIcon, LoadingBar } from '../../General';
import css from '../styles/ProfileIndex.less';
import { accentCinnabar, accentTeal } from '../../../styles/variables.less';

const { RangePicker } = DatePicker;
const { timeframeRefs, moneyOperationTypeRefs, dateFormat } = TYPE;

class CashFlowList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentList: [],
      tooltipText: '点我复制到剪贴板',
      sorting: '',
      searchText: '',
      manualTimeframe: false,
      typeDropdownVisible: false
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.onClearDateClick = this.onClearDateClick.bind(this);
    this.onCopySuccess = this.onCopySuccess.bind(this);
    this.onInitialListClick = this.props.onInitialListClick;
    this.onDateChange = this.onDateChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onTimeframeChange = this.onTimeframeChange.bind(this);
    this.onToggleDateClick = this.onToggleDateClick.bind(this);
    this.onToolTipVisibleChange = this.onToolTipVisibleChange.bind(this);
    this.onTypeDropdownVisibleChange = this.onTypeDropdownVisibleChange.bind(this);
    this.onTypeToggle = this.onTypeToggle.bind(this);
    this.onAllOperatesClick = this.onAllOperatesClick.bind(this);
    this.awaitingResponse = false;
  }
  componentWillMount() {
    this.dispatch({ type: 'userModel/getMyCashFlow' }); 
  }
  componentWillReceiveProps(nextProps) {
    this.sliceList(nextProps);
    if (this.props.awaitingResponse !== nextProps.awaitingResponse) {
      this.awaitingResponse = nextProps.awaitingResponse;
    }
    if (this.props.targetUser !== nextProps.targetUser) {
      this.dispatch({ type: 'userModel/getMyCashFlow' });
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'dataTableModel/initializeState',
      payload: [
        'pageSize', 'state', 'startTime',
        'endTime', 'dayCounts', 'moneyOperationTypes', 'targetUser'
      ]
    });
    this.dispatch({
      type: 'userModel/initializeState', payload: ['myCashFlow']
    });
  }
  onAllOperatesClick() {
    const { moneyOperationTypes } = this.props;
    if (_.isEqual(moneyOperationTypes, _.keys(TYPE.moneyOperationTypeRefs))) {
      this.dispatch({
        type: 'dataTableModel/updateState',
        payload: { moneyOperationTypes: [] }
      });
    } else {
      this.dispatch({
        type: 'dataTableModel/initializeState',
        payload: ['moneyOperationTypes']
      });
    }
    this.dispatch({ type: 'userModel/getMyCashFlow' });
  }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'dataTableModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'userModel/getMyCashFlow' });    
  }
  onSearchChange(event) {
    if (event.target) {
      const { value } = event.target;
      this.setState({ searchText: value });
    }
  }
  onSearchClear() {
    this.setState({ searchText: '' });
    this.dispatch({ type: 'userModel/getMyCashFlow' });
  }
  onSearchClick() { this.dispatch({ type: 'userModel/getMyCashFlow' }); }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onPageChange(currentPage, pageSize) {
    const start = (currentPage - 1) * pageSize;
    this.dispatch({ type: 'dataTableModel/updateState', payload: { start } });
    this.dispatch({ type: 'userModel/getMyCashFlow' });
  }
  onTypeDropdownVisibleChange(flag) {
    this.setState({ typeDropdownVisible: flag });
  }
  onSortChange(direction) {
    const { sorting } = this.state;
    if (sorting === direction) {
      this.setState({ sorting: '' });
    } else {
      this.setState({ sorting: direction }); 
    }
    this.dispatch({ type: 'userModel/getMyCashFlow' });
  }
  onClearDateClick() {
    const { dayCounts } = this.props;
    const newStartTime = moment(new Date()).add(-dayCounts, 'days');
    this.dispatch({
      type: 'dataTableModel/updateState',
      payload: { startTime: newStartTime }
    });
    this.dispatch({ type: 'dataTableModel/initializeState', payload: ['endTime'] });
    this.setState({ manualTimeframe: false });
    this.dispatch({ type: 'userModel/getMyCashFlow' });
  }
  onTimeframeChange({ dayCounts }) {
    this.setState({ manualTimeframe: false }); 
    const newStartTime = moment(new Date()).add(-dayCounts, 'days');
    this.dispatch({
      type: 'dataTableModel/updateState',
      payload: { startTime: newStartTime, dayCounts }
    });
    this.dispatch({ type: 'userModel/getMyCashFlow' });    
  }
  onToggleDateClick() {
    this.setState({ manualTimeframe: true });
  }
  onDateChange([startTime, endTime]) {
    if (!startTime && !endTime) {
      this.onClearDateClick();
    } else if (startTime && endTime) {
      this.dispatch({
        type: 'dataTableModel/updateState',
        payload: { startTime, endTime }
      });
      this.dispatch({ type: 'userModel/getMyCashFlow' });
    }
  }
  onTypeToggle(operationType) {
    const { moneyOperationTypes } = this.props;
    const newOperationTypes = [...moneyOperationTypes];
    const typeIndex = moneyOperationTypes.indexOf(operationType);
    if (typeIndex > -1) {
      newOperationTypes.splice(typeIndex, 1);
    } else {
      newOperationTypes.push(operationType);
    }
    this.dispatch({
      type: 'dataTableModel/updateState',
      payload: { moneyOperationTypes: newOperationTypes }
    });
    this.dispatch({ type: 'userModel/getMyCashFlow' });
  }
  sliceList({ myCashFlow }) {
    const { sorting, searchText } = this.state;
    let currentList = [...myCashFlow];
    if (myCashFlow) {
      if (sorting === 'up') {
        currentList = _.sortBy([...currentList], ['delta']);
      } else if (sorting === 'down') {
        currentList = _.reverse(_.sortBy([...currentList], ['delta']));
      }
      if (searchText) {
        currentList = _.reduce(currentList, (newList, listItem) => {
          const { crossReferenceId } = listItem;
          if (crossReferenceId.indexOf(searchText) >= 0) {
            newList.push(listItem);
          }
          return newList;
        }, []);
      }
      this.setState({ currentList });
    }
  }
  renderTableBody() {
    const { currentList } = this.state;
    if (currentList.length) {
      return _.map(currentList, (listItem) => {
        const { createdTime, delta, type } = listItem;
        let { crossReferenceId } = listItem;
        const key = crossReferenceId;
        const cutIndex = crossReferenceId.indexOf(':');
        if (cutIndex > -1) {
          crossReferenceId = _.trimEnd(
            crossReferenceId, crossReferenceId.substring(cutIndex, crossReferenceId.length - 1)
          );
        }
        crossReferenceId = _.trimEnd(crossReferenceId, ':1');
        crossReferenceId = _.trimEnd(crossReferenceId, ':2');
        const deltaColor = delta < 0 ? accentCinnabar : accentTeal;
        const date = moment(createdTime * 1000).format(dateFormat);
        const stringArry = getConcatArray(crossReferenceId);
        return (
          <tr key={`${createdTime}${key}`}>
            <td>{ date }</td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={crossReferenceId}
              >
                <Tooltip
                  title={this.state.tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                    <a className={css.profile_tableAnchor}>
                      <i>{ stringArry[0] }</i>                      
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <MDIcon iconName="multiplication" />
                      <i>{ stringArry[1] }</i>                                            
                    </a>
                </Tooltip>
              </ClipboardButton>
            </td>
            <td>{ type }</td>
            <td data-align="right" style={{ color: deltaColor }}>{ addCommas(delta) }元</td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan="5">暂无数据</td>
      </tr>
    );
  }
  renderTimeframeDropdown() {
    const { manualTimeframe } = this.state;
    const { dayCounts } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        {
          _.map(timeframeRefs, (time) => {
            const { displayText } = time;
            const btnProps = {
              className: css.profile_dropdownMenuItem,
              key: time.dayCounts,
              onClick: this.onTimeframeChange.bind(this, { dayCounts: time.dayCounts }),
              'data-active': dayCounts === time.dayCounts
            };
            return (
              <button {...btnProps}>{ displayText }</button>
            );
          })
        }
        <button
          onClick={this.onToggleDateClick}
          className={css.profile_dropdownMenuItem}
          data-active={manualTimeframe}
        >自定义</button>
      </ul>
    );
  }
  renderTypesDropdown() {
    const { moneyOperationTypes } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        <button
          className={css.profile_dropdownMenuItem__checkBox}
          data-checked={_.isEqual(moneyOperationTypes, _.keys(TYPE.moneyOperationTypeRefs))}
          disabled={this.awaitingResponse}
          onClick={this.onAllOperatesClick}
        >
          <MDIcon iconName="check" />
          <span data-type="label">全部</span>
        </button>
        {
          _.map(moneyOperationTypeRefs, (typeValue, typeKey) => {
            const btnProps = {
              className: css.profile_dropdownMenuItem__checkBox,
              'data-checked': moneyOperationTypes.indexOf(typeKey) > -1,
              key: typeKey,
              onClick: this.onTypeToggle.bind(this, typeKey),
              disabled: this.awaitingResponse
            };
            return (
              <button {...btnProps}>
                <MDIcon iconName="check" />
                <span data-type="label">{ typeValue }</span>
              </button>
            );
          })
        }
      </ul>
    );
  }
  renderDateThead() {
    const { manualTimeframe } = this.state;
    const { dayCounts, startTime, endTime } = this.props;
    const ranges = {};
    _.forEach(timeframeRefs, time => {
      const { displayText } = time;
      if (time.dayCounts) {
        const startRange = moment(new Date()).add(-time.dayCounts, 'days');
        ranges[displayText] = [startRange, endTime];
      }
    });
    if (manualTimeframe) {
      const rangePickerProps = {
        onChange: this.onDateChange,
        defaultValue: [startTime, endTime],
        ranges
      };
      return (
        <td>
          <RangePicker {...rangePickerProps} />
        </td>
      );
    }
    return (
      <td>
        交易时间
        <Dropdown overlay={this.renderTimeframeDropdown()}>
          <button style={{ marginLeft: '0.5rem ' }}>
            { _.find(timeframeRefs, ['dayCounts', dayCounts]).displayText }
            <MDIcon iconName="menu-down" className={css.profile_tableMenuDownIcon} />
          </button>
        </Dropdown>
      </td>
    );
  }
  renderPagination() {
    const { currentPage, pageSize, myCashFlowCount } = this.props;
    return (
      <Pagination
        defaultCurrent={currentPage}
        defaultPageSize={pageSize}
        onChange={this.onPageChange}
        onShowSizeChange={this.onPageSizeChange}
        showQuickJumper
        showSizeChanger
        total={myCashFlowCount}
      />
    );
  }
  renderFormLabel() {
    const { targetUser, profileSelectedNav } = this.props;
    if (profileSelectedNav === 'memberManage' && targetUser) {
      return (
        <h4 className={css.profile_formLabel}>
          <a
            onClick={this.props.onInitialListClick} className={css.profile_breadcrumItem__main}
          >
            <i>我的用户列表</i>
          </a>
          <span disabled className={css.profile_breadcrumItem}>
            <MDIcon iconName="chevron-right" /><i> {targetUser}用户详情</i>
          </span>
          <LoadingBar isLoading={this.awaitingResponse} />
        </h4>
      );
    }
    return (
      <h4 className={css.profile_formLabel}>
        <span disabled className={css.profile_breadcrumItem__main}>
          账户明细
        </span>
        <LoadingBar isLoading={this.awaitingResponse} />
      </h4>
    );
  }
  render() {
    const { sorting, searchText } = this.state;
    return (
      <div>
        <div className={css.profile_contentBody}>
          { this.renderFormLabel() }
          <table className={css.profile_table}>
            <thead>
              <tr>
                { this.renderDateThead() }
                <td>
                  <div className={css.profile_tableSearchBox}>
                    <button onClick={this.onSearchClick.bind(this)}>
                      <MDIcon
                        className={
                          searchText ?
                          css.profile_tableSearchIcon__active : css.profile_tableSearchIcon
                        }
                        iconName="magnify"                   
                      />
                    </button>
                    <input
                      className={css.profile_tableSearchInput}
                      placeholder="收支单号"
                      value={searchText}
                      onChange={this.onSearchChange}
                    />
                    <button onClick={this.onSearchClear.bind(this)}>
                      <MDIcon
                        className={
                          searchText ?
                          css.profile_tableClearIcon__active : css.profile_tableClearIcon
                        }
                        iconName="close-circle"                   
                      />
                    </button>
                  </div>
                </td>
                <td>
                  <Dropdown
                    overlay={this.renderTypesDropdown()}
                    onVisibleChange={this.onTypeDropdownVisibleChange}
                    visible={this.state.typeDropdownVisible}
                  >
                    <button style={{ marginLeft: '0.5rem ' }}>
                      交易类型
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

const mapStatesToProps = ({ userModel, dataTableModel, layoutModel }) => {
  const { myCashFlow, myCashFlowCount, awaitingResponse } = userModel;
  const { profileSelectedNav } = layoutModel;
  return { myCashFlow, myCashFlowCount, awaitingResponse, ...dataTableModel, profileSelectedNav };
};

export default connect(mapStatesToProps)(CashFlowList);
