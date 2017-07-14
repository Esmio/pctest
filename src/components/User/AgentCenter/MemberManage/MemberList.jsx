import React, { Component } from 'react';
import { Dropdown, Pagination } from 'antd'; 
import { LoadingBar, MDIcon } from '../../../General';
import css from '../../styles/ProfileIndex.less';

class MemberList extends Component {
  constructor(props) {
    super(props);
    this.awaitingResponse = false;
    this.dispatch = this.props.dispatch;
    this.initializeParentState = this.props.initializeParentState;
    this.onAgentClick = this.props.onAgentClick;
    this.onBreadcrumClick = this.props.onBreadcrumClick;
    this.onCreateNewClick = this.props.onCreateNewClick;
    this.onEditClick = this.props.onEditClick;
    this.onInitialListClick = this.props.onInitialListClick;
    this.onPageChange = this.props.onPageChange;
    this.onPageSizeChange = this.props.onPageSizeChange;
    this.onSearchChange = this.props.onSearchChange;
    this.onSearchClear = this.props.onSearchClear;
    this.onSearchClick = this.props.onSearchClick;
    this.onTransferClick = this.props.onTransferClick;
    this.onDetailClick = this.props.onDetailClick;
  }
  componentWillMount() {
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.awaitingResponse !== nextProps.awaitingResponse) {
      this.awaitingResponse = nextProps.awaitingResponse;
    }
  }
  renderCtrlBtnsDropdown(member) {
    const { agentId } = this.props;
    return (
      <ul className={css.profile_dropdownMenu}>
        <button
          disabled={agentId}
          onClick={this.onEditClick.bind(this, member)}
          className={css.profile_dropdownMenuItem}
        >修改</button>
        <button
          onClick={this.onTransferClick.bind(this, member)}
          className={css.profile_dropdownMenuItem}
          disabled
        >转账</button>
        <button
          onClick={this.onDetailClick.bind(this, member)}
          className={css.profile_dropdownMenuItem}
        >详情</button>
      </ul>
    );
  }
  renderPagination() {
    const { memberListLength, currentPage, pageSize } = this.props;
    return (
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        onChange={this.onPageChange}
        onShowSizeChange={this.onPageSizeChange}
        showQuickJumper
        showSizeChanger
        total={memberListLength}
      />
    );
  }
  renderBreadcrum() {
    const { agentId, routes } = this.props;
    return _.map(routes, (member, index) => {
      const { userId, username } = member;
      return (
        <a
          disabled={agentId === userId}
          className={css.profile_breadcrumItem}
          key={userId}
          onClick={this.onBreadcrumClick.bind(this, { userId, index })}
        >
          <MDIcon iconName="chevron-right" /><i>{ username }</i>
        </a>
      );
    });
  }
  renderTableBody() {
    const { memberList, memberTypeRefs } = this.props;
    if (memberList.length) {
      return _.map(memberList, (member) => {
        const {
          userId, username, memberType, prizeGroup, teamMemberCount,
          aggregateBets, topupAggregateAmount, withdrawAggregateAmount
        } = member;
        const disabled = memberType !== 'AGENT' || teamMemberCount < 1;
        return (
          <tr key={userId}>
            <td>
              <a
                disabled={disabled}
                className={css.profile_tableAnchor}
                onClick={this.onAgentClick.bind(this, member)}
              >
                {username}
              </a>
            </td>
            <td>{memberTypeRefs[memberType]}</td>
            <td data-align="right">{prizeGroup}</td>
            <td data-align="right">
              <a
                disabled={disabled}
                className={css.profile_tableAnchor}
                onClick={this.onAgentClick.bind(this, member)}
              >
                {teamMemberCount}
              </a>
            </td>
            <td data-align="right">{aggregateBets}</td>
            <td data-align="right">{topupAggregateAmount}</td>
            <td data-align="right">{withdrawAggregateAmount}</td>
            <td data-align="right">
              <Dropdown overlay={this.renderCtrlBtnsDropdown(member)}>
                <a
                  className={css.profile_tableAnchor}
                >
                  <MDIcon iconName="more" />
                </a>
              </Dropdown>
            </td>
          </tr>
        );
      });
    }
    return (
      <tr>
        <td colSpan="8">暂无数据</td>
      </tr>
    );
  }
  render() {
    const { usernameSearchString, routes, renderResponseMsg } = this.props;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>
            <a
              disabled={!routes.length}
              onClick={this.onInitialListClick}
              className={css.profile_breadcrumItem__main}
            >
              我的用户列表
            </a>
            { this.renderBreadcrum() }
            <LoadingBar isLoading={this.awaitingResponse} />
          </h4>
          { renderResponseMsg() }
          <table className={css.profile_table}>
            <thead>
              <tr>
                <td>
                  <div className={css.profile_tableSearchBox}>
                    <button onClick={this.onSearchClick}>
                      <MDIcon
                        className={
                          usernameSearchString ?
                          css.profile_tableSearchIcon__active : css.profile_tableSearchIcon
                        }
                        iconName="magnify"                   
                      />
                    </button>
                    <input
                      className={css.profile_tableSearchInput}
                      placeholder="用户名"
                      value={usernameSearchString}
                      onChange={this.onSearchChange}
                    />
                    <button onClick={this.onSearchClear}>
                      <MDIcon
                        className={
                          usernameSearchString ?
                          css.profile_tableClearIcon__active : css.profile_tableClearIcon
                        }
                        iconName="close-circle" 
                      />
                    </button>
                  </div>
                </td>
                <td>类型</td>
                <td data-align="right">返点</td>
                <td data-align="right">下级人数</td>
                <td data-align="right">个人投注</td>
                <td data-align="right">个人充值</td>
                <td data-align="right">个人提款</td>
                <td data-align="right">操作</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8">
                  <button
                    onClick={this.onCreateNewClick}
                    className={css.propfile_tableAddNewBtn}
                  >
                    <MDIcon iconName="plus" />创建新用户
                  </button>
                </td>
              </tr>
              { this.renderTableBody() }
            </tbody>
          </table>
        </div>
        { this.renderPagination() }
      </div>
    );
  }
}

export default MemberList;
