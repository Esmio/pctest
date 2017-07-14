import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { type as TYPE, addCommas } from '../../../utils/';
import { MDIcon, SLIcon, OrangeButton, LoadingBar } from '../../General';
import Input from '../ProfileInput';
import DigitInput from '../DigitInput';
import lessVar from '../../../styles/variables.less';
import css from '../styles/ProfileIndex.less';

const { accentTeal, accentCinnabar } = lessVar;

class Withdrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimum: 0,
      maximum: 0,
      sufficientWithdraw: false,
      reminderMsg: '',
      balanceIndicateColor: '',
      sufficientBetColor: ''
    };
    this.dispatch = this.props.dispatch.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'userModel/getCardsAndWithdrawDetail' });
    if (this.props.bankAccounts && this.props.bankAccounts.length >= 1) {
      this.setDefaultBankCard(this.props);      
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bankAccounts && nextProps.bankAccounts !== this.props.bankAccounts) {
      this.setDefaultBankCard(nextProps);
    }
    if (
      nextProps.withdrawalSettings !== this.props.withdrawalSettings ||
      nextProps.balance !== this.props.balance
    ) {
      this.validateWithdrawalSettings(nextProps);
    }
  }
  componentWillUnmount() {
    this.initializeWithdrawalForm();
  }
  onRequestSubmit() {
    this.dispatch({ type: 'transferModel/postWithdrawalRequest' });
  }
  onResetClick(event) {
    event.persist();    
    const eventTarget = event.target;
    const { name } = eventTarget;
    const { dispatch } = this.props;
    dispatch({ type: 'formModel/initializeState', payload: [name] });    
  }
  onCheckRecordClick() {
    this.dispatch({
      type: 'layoutModel/updateState',
      payload: { profileSelectedNav: 'withdrawalRecord', profileExpandedNav: 'record' }
    });
  }
  onInputChange(event) {
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });  
    event.persist();
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const payload = { [name]: { value } };
    if (!max || `${value}`.length <= max) {
      this.dispatch({ type: 'formModel/updateState', payload });
    }
  }
  onAmountChange(event) {
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });  
    event.persist();
    const { withdrawalSettings } = this.props;
    const { maxWithdrawCharge } = withdrawalSettings; 
    const { maximum, minimum, chargeMultiply } = this.state;
    const eventTarget = event.target;
    const { placeholder } = eventTarget;
    let { value } = eventTarget;
    let inputMsg = placeholder;
    let icon = 'close-circle-outline';
    let color = accentCinnabar;
    if (value > maximum) {
      inputMsg = `金额无法大于 ${addCommas(maximum)}元`;
      value = maximum;     
    } else if (value < minimum) {
      inputMsg = `金额无法小于 ${addCommas(minimum)}元`;
    } else if (value >= minimum && value <= maximum) {
      inputMsg = '金额通过';
      color = accentTeal;
      icon = 'checkbox-marked-circle-outline';
    }
    let chargeAmount = (value * chargeMultiply).toFixed(2);
    chargeAmount = chargeAmount >= maxWithdrawCharge ? maxWithdrawCharge : chargeAmount;
    this.dispatch({
      type: 'formModel/updateState',
      payload: {
        charge: { value: chargeAmount, inputMsg, color, icon },
        withdrawalAmount: { value, inputMsg, color, icon }
      }
    });
  }
  onClearClick() {
    this.dispatch({ type: 'transferModel/initializeState', payload: ['transactionTimeuuid'] });
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
  }
  onBankNameSelect({ userBankId, bankCardNo, bankName }) {  
    this.dispatch({
      type: 'formModel/updateState',
      payload: {
        bankCardNo: { value: bankCardNo, color: accentTeal },
        bankName: { value: bankName, color: accentTeal }
      }
    });
    this.dispatch({ type: 'transferModel/updateState', payload: { userBankId } });
  }
  setDefaultBankCard({ bankAccounts }) {
    const defaultCard = _.find(bankAccounts, 'isDefault');
    if (defaultCard) {
      const { id, bankCardNo, bankName } = defaultCard;
      this.onBankNameSelect({ userBankId: id, bankCardNo, bankName });
    }
  }
  initializeWithdrawalForm() {
    this.dispatch({ 
      type: 'formModel/initializeState',
      payload: [
        'withdrawalAmount', 'charge', 'bankName',
        'bankCardNo', 'securityPassword', 'responseMsg'
      ]
    });
    this.dispatch({
      type: 'transferModel/initializeState',
      payload: ['transactionTimeuuid']
    });
  }
  validateWithdrawalSettings({
    balance, withdrawalSettings, aggregateBets, aggregateBetRequirements,
    sufficeAggregateBetRequirements, surplusMaxWithdraw, surplusSeconds,
    surplusWithdrawCount, surplusFeeWithdrawCount
  }) {
    const {
      minimumWithdrawAmount, ratioOfChargeExempt, dailyWithdrawLimit
    } = withdrawalSettings;
    let reminderMsg = '';
    let sufficientBetColor = accentTeal;
    let balanceColor = accentTeal;
    let chargeMultiply = 0;
    chargeMultiply = surplusFeeWithdrawCount <= 0 ? (ratioOfChargeExempt / 100).toFixed(2) : 0;
    const sufficientWithdraw = 
      balance >= minimumWithdrawAmount &&
      surplusWithdrawCount > 0 &&
      surplusMaxWithdraw > 0 &&
      surplusSeconds >= 0;
    if (balance < minimumWithdrawAmount) {
      reminderMsg = [
        '最低提现金额是',
        <strong key="minimumWithdrawal">{addCommas(minimumWithdrawAmount)}元</strong>,
        '，您目前的余额是',
        <strong key="balance">{addCommas(balance)}元</strong>,
        '不足以提现哦, 不便之处敬请原谅。'
      ];
      balanceColor = accentCinnabar;      
    } else if (!sufficeAggregateBetRequirements) {
      chargeMultiply = (ratioOfChargeExempt / 100).toFixed(2);
      reminderMsg = [
        '您目前的投注量是',
        <strong key="currentBets">{addCommas(aggregateBets)}元</strong>,
        '，只要达到',
        <strong key="betRequirement">{addCommas(aggregateBetRequirements)}元</strong>,
        '投注量就能免手续费哦'
      ];
      sufficientBetColor = accentCinnabar;
    } else if (surplusMaxWithdraw < minimumWithdrawAmount) {
      reminderMsg = [
        '您今天所剩余能提现金额是',
        <strong key="betRequirement">{addCommas(surplusMaxWithdraw)}元</strong>,
        '，少于最低提款金额',
        <strong key="currentBets">{addCommas(minimumWithdrawAmount)}元</strong>,
        '不足以提现哦, 不便之处敬请原谅。'
      ];
    } else if (surplusWithdrawCount <= 0) {
      reminderMsg = [
        '已经超出一天能提现的次数，无法再提现，不便之处敬请原谅。',
      ];
    } else if (surplusSeconds < 0) {
      reminderMsg = [
        '提现次数过于频密，系统正进行缓冲。请在',
        <strong key="betRequirement">
          {moment.duration(Math.abs(surplusSeconds), 's').humanize()}
        </strong>,
        '后再进行提现，不便之处敬请原谅。',
      ];
    }
    this.setState({
      maximum: dailyWithdrawLimit,
      minimum: minimumWithdrawAmount,
      sufficientWithdraw,
      reminderMsg,
      chargeMultiply,
      sufficientBetColor,
      balanceColor
    });
  }
  validateInput(payload) {
    this.dispatch({
      type: 'formModel/validateInput', payload
    });
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
  renderReminder() {
    const { reminderMsg } = this.state;
    if (reminderMsg) {
      return (
        <p className={css.profile_disclaimer}>
          <SLIcon
            className={css.profile_disclaimerIcon}
            iconName="info"
          />
          <span>尊敬的用户，{reminderMsg}</span>
        </p>
      );
    }
    return null;
  }
  renderBankOptions() {
    const { sufficientWithdraw } = this.state;        
    const { bankAccounts } = this.props;
    return _.map(bankAccounts, (bank) => {
      const { bankName, bankCardNo, id } = bank;
      const bankInfo = _.find(TYPE.banksOptions, ['displayName', bankName]);
      const { website } = bankInfo;
      return (
        <button
          disabled={!sufficientWithdraw}
          key={id} className={css.register_option}
          onClick={this.onBankNameSelect.bind(this, {
            userBankId: id, bankCardNo, bankName
          })}
        >
          <img
            className={css.register_optionFavicon} height="14" width="14"
            src={`http://www.google.com/s2/favicons?domain=${website}`} alt={bankName}
          />
          <span className={css.register_optionSpan__Name}>{bankName}</span>
          <span className={css.profile_cardNum}>
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <MDIcon iconName="multiplication" />
            <span className={css.profile_cardNum__last4}>
              { bankCardNo.substring(bankCardNo.length - 4, bankCardNo.length) }
            </span>
          </span>
        </button>
      );
    });
  }
  renderBankCardNoInput() {
    const { bankCardNo } = this.props;
    const { value, inputMsg, icon, color } = bankCardNo;
    return (
      <Input
        readOnly
        disabled
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.bankCardNo}`}
        max="19" min="16"
        name="bankCardNo"
        pattern="\d[0-9]\d"
        placeholder="请输入 16-19 位银行卡号"
        value={value}
      />
    );
  }
  renderBankAccountsInput() {
    const { sufficientWithdraw } = this.state;
    const { bankName } = this.props;
    const { value, inputMsg, icon, color } = bankName;
    return (
      <Input
        readOnly={!sufficientWithdraw}
        disabled={!sufficientWithdraw}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.bankName}`}
        min="2" max="10"
        name="bankName"
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请输入 2-10 位中文字符"
        renderOptions={this.renderBankOptions.bind(this)}
        mouseLeaveSensitive
        value={value}
      />
    );
  }
  renderWithdrawalAmount() {
    const { maximum, minimum, sufficientWithdraw } = this.state;
    const { withdrawalAmount } = this.props;
    const { value, inputMsg, icon, color } = withdrawalAmount;
    return (
      <Input
        readOnly={!sufficientWithdraw}
        disabled={!sufficientWithdraw}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.withdrawalAmount}`}
        max={maximum}
        name="withdrawalAmount"
        onChange={this.onAmountChange.bind(this)}
        pattern="\d[0-9]\d"
        type="number"
        placeholder={
          `请输入提现金额，位数介于 ${
            (addCommas(10))} - ${(addCommas(maximum))
          }`
        }
        defaultValue={minimum}
        value={value}
      />
    );
  }
  renderSecurityInput() {
    const { sufficientWithdraw } = this.state;    
    const { securityPassword } = this.props;
    const { value, inputMsg, icon, color } = securityPassword;
    return (
      <DigitInput
        readOnly={!sufficientWithdraw}
        disabled={!sufficientWithdraw}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.securityPassword}`}
        max="4"
        min="4"
        name="securityPassword"
        onBlur={this.validateInput.bind(this)}
        onChange={this.onInputChange.bind(this)}
        onClick={this.onResetClick.bind(this)}
        pattern="\d[0-9]\d"
        placeholder="请输入 4 位数字"
        type="password"
        value={value}
      />
    );
  }
  renderChargeInput() {
    const {
      charge, withdrawalSettings, surplusFeeWithdrawCount, sufficeAggregateBetRequirements
    } = this.props;
    const { ratioOfChargeExempt } = withdrawalSettings;
    const { value } = charge;
    const waveCharge = surplusFeeWithdrawCount > 0 && sufficeAggregateBetRequirements;
    return (
      <Input
        disabled
        readOnly
        label={`${TYPE.inputFieldRefs.charge}`}
        name="charge"
        type="number"
        placeholder={waveCharge ? '免手续费' : `手续费${ratioOfChargeExempt}%`}
        value={value}
      />
    );
  }
  renderUserCreditInfo() {
    const { balanceColor, sufficientBetColor } = this.state;
    const { balance, aggregateBets, aggregateBetRequirements } = this.props;
    return (
      <div className={css.profile_inputInlineRow}>
        <div
          style={{ marginRight: '0.5rem' }}
          className={css.profile_inputInlineBlock}
        >
          <Input
            readOnly
            disabled
            dataColor={balanceColor}
            label="可提取余额"
            value={addCommas(balance)}
          />
        </div>
        <div className={css.profile_inputInlineBlock}>
          <Input
            style={{
              borderTopRightRadius: 0,
              borderRight: 0,
              borderBottomRightRadius: 0
            }}
            dataColor={sufficientBetColor}
            readOnly
            disabled
            label="已达投注量"
            value={`${addCommas(aggregateBets)}元`}
          />
        </div>
        <div className={css.profile_inputInlineBlock}>
          <Input
            style={{
              borderTopLeftRadius: 0,
              borderLeft: 0,
              borderBottomLeftRadius: 0
            }}
            dataColor={sufficientBetColor}            
            readOnly
            disabled
            label="需达投注量"
            value={`/ ${addCommas(aggregateBetRequirements)}元`}
          />
        </div>
      </div>
    );
  }
  renderBtnRow() {
    const { sufficientWithdraw } = this.state;
    const { awaitingResponse, transactionTimeuuid } = this.props;
    if (transactionTimeuuid) {
      return (
        <div className={css.profile_formBtnRow}>
          <button
            className={css.profile_formBtn}
            onClick={this.onClearClick.bind(this)}
          >重置
          </button>
          <OrangeButton
            className={css.profile_formSubmitBtn}
            onClick={this.onCheckRecordClick.bind(this)}
            placeholder="查看提款记录"
          />
        </div>
      );
    }
    return (
      <div className={css.profile_formBtnRow}>
        <button
          className={css.profile_formBtn}
          onClick={this.onClearClick.bind(this)}
        >重置
        </button>
        <OrangeButton
          loading={awaitingResponse}
          disabled={!sufficientWithdraw}
          className={css.profile_formSubmitBtn}
          onClick={this.onRequestSubmit.bind(this)}
          placeholder={awaitingResponse ? '请稍等' : '提交确认'}
        />
      </div>
    );
  }
  renderForm() {
    return (
      <div>
        { this.renderReminder() }
        { this.renderUserCreditInfo() }
        { this.renderBankAccountsInput() }
        { this.renderBankCardNoInput() }
        { this.renderWithdrawalAmount() }
        { this.renderChargeInput() }
        { this.renderSecurityInput() }
      </div>
    );
  }
  renderScene() {
    const { bankAccounts } = this.props;
    if (!bankAccounts || bankAccounts.length < 1) {
      return (
        <p className={css.profile_disclaimer}>
          <SLIcon
            className={css.profile_disclaimerIcon}
            iconName="info"
          />
          <span>尊敬的用户，请先添加银行卡</span>
        </p>
      );
    }
    return this.renderForm();
  }
  render() {
    const { awaitingResponse } = this.props;
    return (
      <div>
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>
            账户提现
            <LoadingBar isLoading={awaitingResponse} />
          </h4>
          { this.renderScene() }
        </div>
        { this.renderResponseMsg() }
        { this.renderBtnRow() }
      </div>
    );
  }
}

const mapStateToProps = ({ userModel, formModel, transferModel }) => {
  const { bankAccounts, dailyWithdrawWithAdminSettingsResult } = userModel;
  const { awaitingResponse, transactionTimeuuid } = transferModel;
  return {
    ...dailyWithdrawWithAdminSettingsResult,
     ...formModel,
    bankAccounts,
    awaitingResponse,
    transactionTimeuuid
  };
};

export default connect(mapStateToProps)(Withdrawal);
