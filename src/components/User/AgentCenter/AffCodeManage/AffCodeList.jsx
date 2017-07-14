import React, { Component } from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';

import ClipboardButton from 'react-clipboard.js';

import css from '../../styles/ProfileIndex.less';
import { MDIcon, LoadingBar, ToggleBtn, Button } from '../../../General';

class AffCodeList extends Component {
  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch;
    this.onEditClick = this.props.onEditClick;
    this.onQuickToggle = this.props.onQuickToggle;
    this.onCopySuccess = this.props.onCopySuccess;
    this.onToolTipVisibleChange = this.props.onToolTipVisibleChange;
  }
  renderTableBody() {
    const {
      awaitingResponse, affCodeList, memberTypeRefs, tooltipText,
    } = this.props;
    if (affCodeList.length) {
      return _.map(affCodeList, (listItem) => {
        const {
          id, updatedTime, affCode, memberType, prizeGroup, status, url, countUser
        } = listItem;
        const date = moment(updatedTime).fromNow();
        return (
          <tr key={id} >
            <td>{ date }</td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={affCode}
              >
                <Tooltip
                  title={tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                  <a className={css.profile_tableAnchor}>
                    <i>{ affCode }</i>
                  </a>
                </Tooltip>
              </ClipboardButton>
            </td>
            <td>
              <ClipboardButton
                onSuccess={this.onCopySuccess}
                data-clipboard-text={url}
              >
                <Tooltip
                  title={tooltipText}
                  onVisibleChange={this.onToolTipVisibleChange}
                >
                  <a className={css.profile_tableAnchor}>
                    <i>{ url }</i>
                  </a>
                </Tooltip>
              </ClipboardButton>
            </td>
            <td>{ memberTypeRefs[memberType] }</td>
            <td data-align="right">{ countUser }</td>
            <td data-align="right">{ prizeGroup }</td>
            <td data-align="right">
              <div className={css.profile_tableCtrlsRow}>
                <Button
                  placeholder="修改"
                  className={css.profile_tableBtn}
                  onClick={this.onEditClick.bind(this, listItem)}
                />
                <ToggleBtn
                  disabled={awaitingResponse}
                  onClick={this.onQuickToggle.bind(this,
                    { id, status }
                  )}
                  checked={status === 'ON'}
                />
              </div>
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
  render() {
    const { awaitingResponse, renderResponseMsg, onCreateNewClick } = this.props;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          邀请码列表
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        { renderResponseMsg() }
        <table className={css.profile_table}>
          <thead>
            <tr>
              <td width="10%">最后更新</td>
              <td width="20%">邀请码</td>
              <td width="25%">邀请码链接</td>
              <td width="10%">用户类别</td>
              <td width="10%" data-align="right">注册用户数</td>
              <td width="10%" data-align="right">返点</td>
              <td width="15%" data-align="right">操作</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7">
                <button
                  onClick={onCreateNewClick}
                  className={css.propfile_tableAddNewBtn}
                >
                  <MDIcon iconName="plus" />创建新邀请码
                </button>
              </td>
            </tr>
            { this.renderTableBody() }
          </tbody>
        </table>
      </div>
    );
  }
}

export default AffCodeList;
