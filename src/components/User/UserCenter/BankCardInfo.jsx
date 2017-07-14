import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Popconfirm } from 'antd';
import { type as TYPE } from '../../../utils/';
import { SLIcon, MDIcon, OrangeButton, RedButton, LoadingBar } from '../../General';
import Input from '../ProfileInput';
import DigitInput from '../DigitInput';
import css from '../styles/ProfileIndex.less';
import { accentTeal } from '../../../styles/variables.less';

class BankCardInfo extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }
  
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'userModel/getCardsAndWithdrawDetail' });
    if (this.props.userData) {
      this.getUserRealName(this.props);
    }
    if (this.props.bankAccounts) {
      this.getDefaultCard(this.props);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.userData !== this.props.userData) {
      this.getUserRealName(nextProps);
    }
    if (
      nextProps.bankAccounts !== this.props.bankAccounts
    ) {
      this.getDefaultCard(nextProps);
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/initializeState',
      payload: [
        'responseMsg', 'bankAccountName', 'bankName', 'realName',
        'securityPassword', 'repeatSecurityPassword', 'bankCode',
        'bankAddress', 'bankCardNo', 'remarks', 'bankCardExist',
        'cardIsDefault'
      ]
    });
  }
  onResetClick(event) {
    event.persist();    
    const eventTarget = event.target;
    const { name } = eventTarget;
    const { dispatch } = this.props;
    dispatch({ type: 'formModel/initializeState', payload: [name] });    
  }
  onDeleteCard() {
    const { dispatch } = this.props;
    dispatch({ type: 'userModel/deleteBankAccount' });
  }
  onSetDefaultClick() {
    const { dispatch } = this.props;
    dispatch({ type: 'userModel/putDefaultBankAccount' });
  }
  onInputChange(event) {
    event.persist();
    const eventTarget = event.target;
    const { value, max, name, min } = eventTarget;
    if (`${value}`.length <= _.toNumber(max)) {
      const payload = { [name]: { value } };
      this.dispatch({ type: 'formModel/updateState', payload });
      this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
      if (value.length >= min) {
        this.validateInput(event);
      }
    }
  }
  onSubmitInfoClick() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userModel/putRegisterInfo'
    });
  }
  onAddCardClick() {
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    const { dispatch } = this.props;
    dispatch({
      type: 'userModel/postBankInfo'
    });
  }
  onBankNameSelect({ bank, bankId }) {
    const { dispatch } = this.props;
    const { displayName } = bank;
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    dispatch({
      type: 'formModel/updateState',
      payload: {
        bankName: {
          value: displayName, color: accentTeal
        },
        bankCode: {
          value: bankId, color: accentTeal
        }
      }
    });
  }
  getUserRealName({ userData }) {
    const { dispatch } = this.props;
    const { realName } = userData;
    if (realName) {
      dispatch({
        type: 'formModel/updateState',
        payload: {
          bankAccountName: {
            value: realName
          }
        }
      });
    }
  }
  getDefaultCard({ bankAccounts, dispatch }) {
    if (bankAccounts.length) {
      const defaultBankCard = _.find(bankAccounts, 'isDefault');
      dispatch({
        type: 'userModel/updateState', payload: { selectedBankCardId: defaultBankCard.id }
      });
      dispatch({ type: 'formModel/getBankCardDetails' });
    }
  }
  validateInput(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/validateInput', payload
    });
  }
  validateRepeatInput(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/validateRepeatInput', payload
    });
  }
  renderBankAccountName() {
    const { bankAccountName, realName } = this.props;
    const { value, inputMsg, icon, color } = bankAccountName;
    return (
      <Input
        readOnly
        disabled
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.bankAccountName}`}
        min="2" max="10"
        name="bankAccountName"
        onBlur={this.validateInput}
        onChange={this.onInputChange}
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请输入 2-10 位中文字符"
        value={value || realName.value}
      />
    );
  }
  renderBankAddress() {
    const { bankAddress, bankCardExist } = this.props;
    const { value, inputMsg, icon, color } = bankAddress;
    return (
      <Input
        readOnly={bankCardExist}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.bankAddress}`}
        min="1" max="150"
        name="bankAddress"
        onBlur={this.validateInput}
        onChange={this.onInputChange}
        pattern="."
        placeholder="请输入银行地址"
        value={value}
      />
    );
  }
  renderBankCardNo() {
    const { bankCardNo, bankCardExist } = this.props;
    const { value, inputMsg, icon, color } = bankCardNo;
    return (
      <Input
        readOnly={bankCardExist}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.bankCardNo}`}
        max="19" min="16"
        name="bankCardNo"
        onBlur={this.validateInput}
        onChange={this.onInputChange}
        pattern="\d[0-9]\d"
        placeholder="请输入 16-19 位银行卡号"
        value={value}
      />
    );
  }
  renderSecurityInput() {
    const { securityPassword } = this.props;
    const { value, inputMsg, icon, color } = securityPassword;
    return (
      <DigitInput
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.securityPassword}`}
        max="4"
        min="4"
        name="securityPassword"
        onBlur={this.validateInput}
        onChange={this.onInputChange}
        onClick={this.onResetClick.bind(this)}
        pattern="\d[0-9]\d"
        placeholder="请输入 4 位数字"
        type="password"
        value={value}
      />
    );
  }
  renderRepeatSecurityInput() {
    const { repeatSecurityPassword } = this.props;
    const { value, inputMsg, icon, color } = repeatSecurityPassword;
    return (
      <DigitInput
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.repeatSecurityPassword}`}
        max="4" min="4"
        name="repeatSecurityPassword"
        onBlur={this.validateRepeatInput.bind(this)}
        onChange={this.onInputChange}
        onClick={this.onResetClick.bind(this)}
        pattern="\d[0-9]\d"
        placeholder="请输入 4 位数字"
        type="password"
        value={value}
      />
    );
  }
  renderResponseMsg() {
    const { responseMsg } = this.props;
    const { msg, color, icon } = responseMsg;
    if (msg) {
      return (
        <div
          style={{ backgroundColor: color }}
          className={css.profile_formResponse}
        >
          <MDIcon iconName={icon} />
          <span>{ msg }</span>
        </div>
      );
    } return null;
  }
  renderRealNameInput() {
    const { realName, bankCardExist } = this.props;
    const { value, inputMsg, icon, color } = realName;
    return (
      <Input
        readOnly={bankCardExist}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.realName}`}
        min="2" max="10"
        name="realName"
        onBlur={this.validateInput}
        onChange={this.onInputChange}
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请输入 2-10 位中文字符"
        value={value}
      />
    );
  }
  renderBankOptions() {
    const { banksOptions } = this.props;
    return _.map(banksOptions, (bank, bankId) => {
      const { displayName, website } = bank;
      return (
        <button
          key={bankId} className={css.profile_option}
          onClick={this.onBankNameSelect.bind(this, { bank, bankId })}
        >
          <span className={css.profile_optionSpan__Name}>{displayName}</span>
          <span className={css.profile_optionSpan__website}>
            <img
              className={css.profile_optionFavicon} height="14" width="14"
              src={`http://www.google.com/s2/favicons?domain=${website}`} alt={displayName}
            />
            { website }
          </span>
        </button>
      );
    });
  } 
  renderBankName() {
    const { bankName, bankCardExist } = this.props;
    const { value, inputMsg, icon, color } = bankName;
    return (
      <Input
        readOnly={bankCardExist}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.bankName}`}
        min="2" max="10"
        name="bankName"
        onBlur={this.validateInput}
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请输入 2-10 位中文字符"
        renderOptions={this.renderBankOptions.bind(this)}
        mouseLeaveSensitive
        value={value}
      />
    );
  }
  renderFormLabel() {
    const { bankCardExist, bankName, cardIsDefault, awaitingResponse } = this.props;
    if (bankCardExist) {
      const { value } = bankName;
      return (
        <h4 className={css.profile_formLabel}>
          { value }卡信息
          { cardIsDefault ? 
            <small className={css.profile_formLabelCaption}>默认银行卡</small> : null 
          }
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
      );
    }
    return (
      <h4 className={css.profile_formLabel}>
        银行卡信息
        <LoadingBar isLoading={awaitingResponse} />
      </h4>
    );
  }
  renderBtnRow() {
    const {
      userData, cardIsDefault, bankCardExist,
      bankName, bankCardNo, bankAddress, bankAccountName,
      securityPassword, repeatSecurityPassword,
      realName
    } = this.props;
    let readyToSubmit = false;
    readyToSubmit = 
      bankAddress.value !== undefined
      && bankName.value !== undefined
      && (bankCardNo.inputMsg && bankCardNo.inputMsg.indexOf('格式正确') > -1);
    if (userData.realName && !bankCardExist) {
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            disabled={!readyToSubmit}
            className={css.profile_formSubmitBtn}
            onClick={this.onAddCardClick.bind(this)}
            placeholder="添加银行卡"
          />
        </div>
      );
    } else if (bankCardExist) {
      return (
        <div className={css.profile_formBtnRow}>
          <Popconfirm
            title={`确定删除${bankName.value}卡？`}
            onConfirm={this.onDeleteCard.bind(this)}
            okText="确定" cancelText="取消"
          >
            <RedButton
              disabled={cardIsDefault}
              className={css.profile_formSubmitBtn}
              placeholder="删除银行卡"
            />
          </Popconfirm>
          <OrangeButton
            disabled={cardIsDefault}
            className={css.profile_formSubmitBtn}
            onClick={this.onSetDefaultClick.bind(this)}
            placeholder="设为默认银行卡"
          />
        </div>
      );
    } else if (!bankCardExist && !userData.realName) {
      readyToSubmit =
        bankAddress.value !== undefined
        && bankName.value !== undefined
        && bankAccountName.value !== undefined
        && (bankCardNo.inputMsg && bankCardNo.inputMsg.indexOf('格式正确') > -1)
        && (securityPassword.inputMsg && securityPassword.inputMsg.indexOf('格式正确') > -1)
        && (repeatSecurityPassword.inputMsg && repeatSecurityPassword.inputMsg.indexOf('格式正确') > -1)
        && (realName.inputMsg && realName.inputMsg.indexOf('格式正确') > -1);
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            disabled={!readyToSubmit}
            className={css.profile_formSubmitBtn}
            onClick={this.onSubmitInfoClick.bind(this)}
            placeholder="添加银行卡"
          />
        </div>
      );
    }
    return null;
  }
  render() {
    const { userData, awaitingResponse } = this.props;
    const { realName } = userData;
    return (
      <div>
        {
          realName ? null :
          <div className={css.profile_contentBody}>
            <h4 className={css.profile_formLabel}>完善提款信息
              <LoadingBar isLoading={awaitingResponse} />
            </h4>
            <p className={css.profile_disclaimer}>
              <SLIcon
                className={css.profile_disclaimerIcon}
                iconName="badge"
              />
              <span>尊敬的用户，为了保障您的资金安全，请您绑定您的姓名和设置取款密码。
              <strong>如果姓名与开户名不一致，将无法取款。</strong></span>
            </p>
            { this.renderRealNameInput() }
            { this.renderSecurityInput() }
            { this.renderRepeatSecurityInput() }
          </div>
        }
        <div className={css.profile_contentBody}>
          { this.renderFormLabel() }
          { this.renderBankAccountName() }
          { this.renderBankName() }
          { this.renderBankAddress() }
          { this.renderBankCardNo() }
        </div>
        { this.renderResponseMsg() }
        { this.renderBtnRow() }
      </div>
    );
  }
}

const mapStatesToProps = ({ userModel, formModel }) => {
  const { bankAccounts, userData, selectedBankCardId, awaitingResponse } = userModel;
  return { selectedBankCardId, bankAccounts, userData, awaitingResponse, ...formModel };
};

export default connect(mapStatesToProps)(BankCardInfo);
