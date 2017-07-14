import React, { Component } from 'react';
import { connect } from 'dva';
import { Popconfirm } from 'antd';
import {
  LoadingBar, MDIcon, RangeInput, ToggleBtn, OrangeButton, RedButton,
  Button
} from '../../../General';
import css from '../../styles/ProfileIndex.less';
import { labelBlue } from '../../../../styles/variables.less';
import Input from '../../ProfileInput';
import { type as TYPE } from '../../../../utils/';

class CreateAffCodeForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.dispatch = this.props.dispatch.bind(this);
    this.generateRandomAffCode = this.props.generateRandomAffCode;
    this.onAffToggle = this.props.onAffToggle;
    this.poluteForm = this.props.poluteForm;
    this.onBackClick = this.props.onBackClick;
    this.onDeleteClick = this.props.onDeleteClick;
    this.onInputChange = this.props.onInputChange;
    this.onRadioSelect = this.props.onRadioSelect;
    this.onRangeChange = this.props.onRangeChange;
    this.onSubmitClick = this.props.onSubmitClick;
    this.validateInput = this.props.validateInput;
    this.onGenerateAffCodeClick = this.onGenerateAffCodeClick.bind(this);
  }
  componentWillMount() {
    if (this.props.isCreatingNew) {
      this.generateRandomAffCode();
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'formModel/initializeState',
      payload: ['affCode', 'memberType', 'affCodeStatus', 'affCodeUrl', 'prizeGroup']
    });
  }
  onGenerateAffCodeClick() {
    this.poluteForm();
    this.generateRandomAffCode();
  }
  renderOptions() {
    const { memberType } = this.props;
    const isPlayer = memberType === 'PLAYER';
    const isAgent = memberType === 'AGENT';
    return (
      <div className={css.profile_radioRow}>
        <label className={css.profile_inputLabel} htmlFor="securityMode">用户类型</label>
        <button
          name="PLAYER"
          onClick={this.onRadioSelect.bind(this, 'PLAYER')}
          className={css.profile_radioBtn}
          data-checked={isPlayer}
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
          name="AGENT"
          onClick={this.onRadioSelect.bind(this, 'AGENT')}
          className={css.profile_radioBtn}
          data-checked={isAgent}
        >
          <MDIcon
            iconName={isAgent ? 'radiobox-marked' : 'radiobox-blank'}
          />
          <span>代理</span>
        </button>
      </div>
    );
  }
  renderAffCodeInput() {
    const {
      affCode, awaitingResponse, inputFieldRefs, isCreatingNew
    } = this.props;
    const { value, color, icon, inputMsg } = affCode;
    return (
      <Input
        readOnly={!isCreatingNew}
        disabled={awaitingResponse || !isCreatingNew}
				dataColor={color}
				dataIcon={icon}
				dataMsg={inputMsg}
				label={inputFieldRefs.affCode}
				min="6" max="20"
				name="affCode"
				onBlur={this.validateInput}
				onChange={this.onInputChange}
				pattern="^[A-Za-z0-9]\w{5,11}$"
				placeholder="请输入字母和数字组成的6-20个字符"
				value={value}
      />
    );
  }
  renderToggleBtn() {
    const { affCodeStatus } = this.props;
    const { value } = affCodeStatus;
    return (
      <ToggleBtn
        onClick={this.onAffToggle}
        label={TYPE.inputFieldRefs.affCodeStatus}
        placeholder="启用邀请码"
        checked={value === 'ON'}
      />
    );
  }
  renderRangeInput() {
    const { prizeGroup, userData } = this.props;
    const maxRange = userData.prizeGroup;
    const { value } = prizeGroup;
    return (
      <RangeInput
        dataColor={labelBlue}
        indicatorLabel={value}
        label={TYPE.inputFieldRefs.prizeGroup}
        max={maxRange}
        maxLabel={userData.prizeGroup}
        min={1800}
        minLabel="1800"
        name="prizeGroup"
        onChange={this.onRangeChange}
        onDrag={this.onRangeChange}
        shouldShowValue
        step={2}
        value={value}
      />
    );
  }
  renderForm() {
    const { awaitingResponse, isCreatingNew, renderResponseMsg } = this.props;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          <a
            onClick={this.onBackClick} className={css.profile_breadcrumItem__main}
          >
            邀请码列表
          </a>
          <span disabled className={css.profile_breadcrumItem}>
            <MDIcon iconName="chevron-right" /><i>{ isCreatingNew ? '创建新' : '修改'}邀请码</i>
          </span>
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        { renderResponseMsg() }
        <div className={css.profile_inputInlineRow}>
          <div className={css.profile_inputInlineBlock}>
            { this.renderToggleBtn() }
          </div>
          <div className={css.profile_inputInlineBlock}>
            { this.renderOptions() }
          </div>
          <div className={css.profile_inputInlineBlock} style={{ flex: 2 }}>
            { this.renderRangeInput() }
          </div>
        </div>
        <div className={css.profile_inputInlineRow}>
          <div className={css.profile_inputInlineBlock}>
            { this.renderAffCodeInput() }
          </div>
          { isCreatingNew ?
            <button
              onClick={this.onGenerateAffCodeClick}
              className={css.profile_inputInlineBtn}
            >生成邀请码</button> : null
          }
        </div>
      </div>
    );
  }
  renderBtnRow() {
    const {
      memberType, awaitingResponse, affCode, editTarget, formIsPristine, isCreatingNew
    } = this.props;
    const { value } = affCode;
    const submitDisabled = this.awaitingResponse || !value || formIsPristine || !memberType;
    return (
      <div className={css.profile_formBtnRow}>
        <Button
          onClick={this.onBackClick}
          placeholder="取消"
        />
        <OrangeButton
          loading={awaitingResponse}
          disabled={submitDisabled}
          className={css.profile_formSubmitBtn}
          onClick={this.onSubmitClick}
          placeholder={isCreatingNew ? '创建新邀请码' : '确定修改'}
        />
        { editTarget ?
          <Popconfirm
            title="确定要删除吗？" okText="确定" cancelText="取消"
            onConfirm={this.onDeleteClick}
          >
            <RedButton
              placeholder='删除邀请码'
            />
          </Popconfirm>
          : null
        }
      </div>
    );
  }
  render() {
    return (
      <div>
        { this.renderForm() }
        { this.renderBtnRow() }
      </div>
    );
  }
}

const mapStateToProps = ({ teamModel, formModel, userModel }) => {
  const { userData } = userModel;
  return { userData, ...teamModel, ...formModel };
};

export default connect(mapStateToProps)(CreateAffCodeForm);
