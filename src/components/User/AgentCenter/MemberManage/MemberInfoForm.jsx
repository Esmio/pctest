import React, { Component } from 'react';
import { MDIcon, LoadingBar, OrangeButton, RangeInput, Button } from '../../../General';
import css from '../../styles/ProfileIndex.less';
import Input from '../../ProfileInput';
import { labelBlue } from '../../../../styles/variables.less';

class MemberInfoForm extends Component {
  constructor(props) {
    super(props);
    this.awaitingResponse = false;
    this.dispatch = this.props.dispatch;
    this.onBackClick = this.props.onBackClick;
    this.onInitialListClick = this.props.onInitialListClick;
    this.onInputChange = this.props.onInputChange;
    this.onRadioSelect = this.props.onRadioSelect;
    this.onRangeChange = this.props.onRangeChange;
    this.onSubmitClick = this.props.onSubmitClick;
    this.validateInput = this.props.validateInput;
    this.validateUsername = this.props.validateUsername;
    this.memberType = this.props.memberType;
    this.initializeParentState = this.props.initializeParentState;
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.awaitingResponse !== nextProps.awaitingResponse) {
      this.awaitingResponse = nextProps.awaitingResponse;
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'formModel/initializeState',
      payload: [
        'username', 'password', 'realName', 'email', 'responseMsg',
        'memberType', 'prizeGroup'
      ] 
    });
  }
  renderOptions() {
    const { memberType, initialMemberType, mode } = this.props;
    const isPlayer = memberType === 'PLAYER';
    const isAgent = memberType === 'AGENT';
    const userSelectDisabled = mode !== 'CREATE' && initialMemberType === 'AGENT';
    return (
      <div className={css.profile_radioRow}>
        <label className={css.profile_inputLabel} htmlFor="memberType">用户类别</label>
        <button
          disabled={userSelectDisabled}
          className={css.profile_radioBtn}
          data-checked={isPlayer}          
          name="PLAYER"
          onClick={this.onRadioSelect.bind(this, 'PLAYER')}
        >
          <MDIcon
            iconName={
              isPlayer ?
              'radiobox-marked' : 'radiobox-blank'
            }
          />
          <span>会员</span>
        </button>
        <button
          className={css.profile_radioBtn}
          data-checked={isAgent}
          name="AGENT"
          onClick={this.onRadioSelect.bind(this, 'AGENT')}
        >
          <MDIcon
            iconName={
              isAgent ?
              'radiobox-marked' : 'radiobox-blank'
            }
          />
          <span>代理</span>
        </button>
      </div>
    );
  }
  renderUsernameInput() {
		const { username, inputFieldRefs, mode } = this.props;
    const { value, inputMsg, icon, color } = username;
    const inputDisabled = mode === 'EDIT' || this.awaitingResponse;
		return (
			<Input
				disabled={inputDisabled}
				dataColor={color}
				dataIcon={icon}
				dataMsg={inputMsg}
				label={inputFieldRefs.username}
        min="5" max="12"
				name="username"
				onBlur={this.validateUsername}
				onChange={this.onInputChange}
				pattern="^[A-Za-z0-9]\w{4,12}$"
				placeholder="请输入字母和数字组成的5-12个字符"
				value={value}
			/>
		);
	}
  renderRangeInput() {
    const { prizeGroup, userData, inputFieldRefs } = this.props;
    const maxRange = userData.prizeGroup;
    const { value } = prizeGroup;

    return (
      <RangeInput
        dataColor={labelBlue}
        onDrag={this.onRangeChange}
        onChange={this.onRangeChange}
        minLabel="1800"
        maxLabel={maxRange}
        shouldShowValue
        indicatorLabel={value}
        label={inputFieldRefs.prizeGroup}
        name="prizeGroup"
        min={1800}
        max={maxRange}
        step={2}
        value={value}
      />
    );
  }
  renderBtnRow() {
    const { username, formIsPristine, memberType, mode } = this.props;
    const { value } = username;
    const submitDisabled = this.awaitingResponse || !value || formIsPristine || !memberType;
    let submitBtnPlaceholder = '创建新用户';
    if (mode === 'EDIT') {
      submitBtnPlaceholder = '确定修改';
    }
    return (
      <div className={css.profile_formBtnRow}>
        <Button
          onClick={this.onBackClick}
          placeholder="取消"
        />
        <OrangeButton
          loading={this.awaitingResponse}
          disabled={submitDisabled}
          className={css.profile_formSubmitBtn}
          onClick={this.onSubmitClick}
          placeholder={submitBtnPlaceholder}
        />
      </div>
    );
  }
  renderPasswordInput() {
    const { password, inputFieldRefs, mode } = this.props;
    if (mode === 'CREATE') {
      const { value } = password; 
      return (
        <Input
          value={value}
          dataIcon="information-outline"
          disabled
          dataMsg="用户登录后需自行修改"
          label={`默认${inputFieldRefs.password}`}
        />
      );
    } return null;
  }
  render() {
    const { renderResponseMsg, mode } = this.props;
    let breadcrumbText = '创建新用户';
    if (mode === 'EDIT') {
      breadcrumbText = '修改用户';
    }
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>
            <a
              onClick={this.onBackClick} className={css.profile_breadcrumItem__main}
            >
              我的用户列表
            </a>
            <a disabled className={css.profile_breadcrumItem}>
              <MDIcon iconName="chevron-right" /><i>{ breadcrumbText }</i>
            </a>
            <LoadingBar isLoading={this.awaitingResponse} />
          </h4>
          { renderResponseMsg() }
          { this.renderUsernameInput() }
          { this.renderPasswordInput() }
          <div className={css.profile_inputInlineRow}>
            <div style={{ display: 'flex', flex: 0.5 }}>
              { this.renderOptions() }
            </div>
            <div className={css.profile_inputInlineBlock}>
              { this.renderRangeInput() }
            </div>
          </div>
        </div>
        { this.renderBtnRow() }
      </div>
    );
  }
}

export default MemberInfoForm;
