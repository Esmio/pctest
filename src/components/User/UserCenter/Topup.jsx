import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { DatePicker } from 'antd';
import QRCode from 'qrcode.react';
import { MDIcon, OrangeButton, EllipsisLoader, LoadingBar } from '../../General';
import { type as TYPE, addCommas, randomWord } from '../../../utils/';
import Input from '../ProfileInput';
import css from '../styles/ProfileIndex.less';

class TopUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      QRImageLoading: true
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'transferModel/getPaymentList' });
    this.dispatch({ type: 'transferModel/getBankList' });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.paymentList !== this.props.paymentList) {
      this.selectDefaultPaymentId(nextProps);      
    }
  }
  componentWillUnmount() {
    this.initializeTopupContent();
  }
  onQRImgLoad() {
    this.setState({ QRImageLoading: false });
  }
  onTopupRequestSubmit() {
    const { dataImgUrl } = this.props;
    const randomString = randomWord(true, 4, 4);
    const timeString = (+new Date()).toString();
    let paymentPlatformOrderNo = `${randomString}${timeString}`;
    paymentPlatformOrderNo = _.trim(paymentPlatformOrderNo);
    if (dataImgUrl) {
      this.dispatch({
        type: 'transferModel/updateState',
        payload: {
          paymentPlatformOrderNo
        },
      });
      this.dispatch({ type: 'transferModel/putOddTransferRequest' });
    } else {
      this.dispatch({ type: 'transferModel/postTopups' });
    }
  }
  onDateChange(value) {
    console.log(value);
    this.dispatch({ type: 'formModel/updateState', payload: { topupTime: { value } } });
  }
  onInputChange(event) {
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      this.dispatch({ type: 'formModel/updateState', payload });
      this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    }
    this.setState({ formIsPristine: false });
  }
  onAmountChange(event) {
    const eventTarget = event.target;
    const { name } = eventTarget;
    let { value, max, min } = eventTarget;
    value = _.toNumber((_.toNumber(value)).toFixed(2));
    max = _.toNumber(max);
    min = _.toNumber(min);
    if (value > max) {
      value = max;
    } else if (value < min) {
      value = '';
    }
    const payload = { [name]: { value } };
    this.dispatch({ type: 'formModel/updateState', payload });
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    this.setState({ formIsPristine: false });    
  }
  onAmountSelect(amount) {
    this.dispatch({
      type: 'formModel/updateState',
      payload: {
        topupAmount: { value: amount },
      }
    });
  }
  onCheckRecordClick() {
    this.dispatch({
      type: 'layoutModel/updateState',
      payload: { profileSelectedNav: 'topupRecord', profileExpandedNav: 'record' }
    });
  }
  onBankTransferConfirm() {
    this.dispatch({ type: 'transferModel/putBankTransferConfirmation' });
  }
  onTopupTypeSelect(transferToupType) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/updateState',
      payload: {
        transferToupType: { value: transferToupType },
      }
    });
  }
  initializeTopupContent() {
    this.dispatch({
      type: 'transferModel/initializeState',
      payload: [
        'adminBankId', 'merchantName', 'paymentId', 'paymentType', 'topupType',
        'dataImg', 'data', 'webview', 'paymentMethod', 'transactionId', 'amount',
        'paymentPlatformCode', 'transferNo', 'bankCardNo'
      ]
    });
    this.dispatch({
      type: 'formModel/initializeState',
      payload: [
        'bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks', 'responseMsg',
        'topupAmount', 'transferToupType', 'topupCardRealname', 'topupTime',
      ]
    });
  }
  validateInput(payload) {
    const { dispatch } = this.props;
    dispatch({
      type: 'formModel/validateInput', payload
    });
  }
  selectDefaultPaymentId({ paymentList, topupType }) {
    const defaultPayment = _.find(paymentList, { type: topupType });
    if (defaultPayment) {
      const { type, merchantName, paymentId, paymentType, bankCode } = defaultPayment;
      const notWAP = paymentType !== 'WAP' && bankCode !== 'WAP';
      if (notWAP) {
        this.dispatch({
          type: 'transferModel/updateState',
          payload: {
            merchantName,
            paymentId,
            paymentType,
            topupType: type,
          }
        });
      }
    }
  }
  renderQRCode() {
    const { data, merchantName, amount, awaitingResponse } = this.props;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          { merchantName }
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        <p className={css.profile_paymentAmount}>支付金额<br /><strong>¥{ amount }</strong></p>
        <p className={css.profile_reminder}>
          <i>请在{TYPE.paymentTypeRefs[this.props.topupType]}中打开“扫一扫”</i>
          <MDIcon iconName="qrcode-scan" /><br />
          <i>扫描下面的二维码已完成充值。</i>
        </p>
        <div className={css.profile_paymentQRCode}>
          <QRCode value={data} size={250} />
        </div>
      </div>
    );
  }
  renderImage() {
    const {
      dataImg, merchantName, awaitingResponse, topupAmount, paymentPlatformOrderNo
    } = this.props;
    const { QRImageLoading } = this.state;
    const imgClassName = QRImageLoading ? css.profile_paymentImg__hidden : css.profile_paymentImg;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          { merchantName }
          <LoadingBar isLoading={awaitingResponse} />          
        </h4>
        {
          QRImageLoading ? 
          <p className={css.profile_reminder}>
            正努力加载当中<EllipsisLoader duration={3000} />
          </p> :
          <div className={css.profile_topUpSteps}>
            <p className={css.profile_reminder}>
              <i>1. 请在{TYPE.paymentTypeRefs[this.props.paymentKey]}中打开“扫一扫”</i>
            </p>
            <p className={css.profile_reminder}>
              2. 输入充值金额 <strong>¥{ topupAmount.value }</strong> (需与订单金额一致)
            </p>
            <p className={css.profile_reminder}>3. 点击添加备注</p>
            <p className={css.profile_reminder}>
              4. 在充值界面备注订单号 <strong>{paymentPlatformOrderNo}</strong>
            </p>
            <p className={css.profile_reminder}>
              5. 扫描下面的二维码 <MDIcon iconName="qrcode-scan" />
            </p>
          </div>
        }
        <div className={css.profile_paymentQRCode}>
          <img
            onLoad={this.onQRImgLoad.bind(this)}
            className={imgClassName}
            src={dataImg} alt={merchantName}
          />
        </div>
      </div>
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
  renderAmountDropDown() {
    return _.map([50, 100, 300, 500, 1000, 2000, 3000, 5000], (amount) => {
      return (
        <button
          key={amount} className={css.register_option}
          onClick={this.onAmountSelect.bind(this, amount)}
        >
          <span className={css.register_optionSpan__Name}>{addCommas(amount)}元</span>
        </button>
      );
    });
  }
  renderTransferDropDown() {
    return _.map(TYPE.bankTransferTypeRefs, (value, key) => {
      if (key === 'UNRECOGNIZED') return null;
      return (
        <button
          key={key} className={css.register_option}
          onClick={this.onTopupTypeSelect.bind(this, key)}
        >
          <span className={css.register_optionSpan__Name}>{ value }</span>
        </button>
      );
    });
  }
  renderBtnRow() {
    const {
      topupAmount, awaitingResponse, paymentId, transferToupType, topupCardRealname,
      transferNo, data, dataImg
    } = this.props;
    if (dataImg) {
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            disabled={awaitingResponse}
            className={css.profile_formSubmitBtn}
            onClick={this.onCheckRecordClick.bind(this)}
            placeholder={'支付完成，查看订单'}
          />
        </div>
      );
    }
    if (transferNo || data) {
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            disabled={awaitingResponse}
            className={css.profile_formSubmitBtn}
            onClick={this.onCheckRecordClick.bind(this)}
            placeholder={'查看充值记录'}
          />
        </div>
      );
    } else if (paymentId) {
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            loading={awaitingResponse}
            disabled={!topupAmount.value || awaitingResponse}
            className={css.profile_formSubmitBtn}
            onClick={this.onTopupRequestSubmit.bind(this)}
            placeholder={awaitingResponse ? '请稍等' : '继续下一步'}
          />
        </div>
      );
    } else {
      const disabled = awaitingResponse ||
        !topupAmount.value || !transferToupType.value || !topupCardRealname.value;
      return (
        <div className={css.profile_formBtnRow}>
          <OrangeButton
            loading={awaitingResponse}
            disabled={disabled}
            className={css.profile_formSubmitBtn}
            onClick={this.onBankTransferConfirm.bind(this)}
            placeholder={awaitingResponse ? '请稍等' : '确认充值'}
          />
        </div>
      );
    }
  }
  renderBankNameInput() {
    const { bankName } = this.props;
    const { value } = bankName;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.bankName}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderBankAddressInput() {
    const { bankAddress } = this.props;
    const { value } = bankAddress;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.bankAddress}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderBankCardNo() {
    const { bankCardNo } = this.props;
    const { value } = bankCardNo;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.bankCardNo}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderReceiptName() {
    const { receiptName } = this.props;
    const { value } = receiptName;
    return (
      <Input
        readOnly
        label={`${TYPE.inputFieldRefs.receiptName}`}
        mouseLeaveSensitive
        value={value || '-'}
      />
    );
  }
  renderTopupAmountInput() {
    const { topupAmount, awaitingResponse } = this.props;
    const { value, icon, color, inputMsg } = topupAmount;
    return (
      <Input
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.topupAmount}`}
        min="1" max="100000"
        mouseLeaveSensitive
        name="topupAmount"
        onChange={this.onAmountChange}
        pattern="\d[0-9]\d"
        placeholder="请选择或输入支付金额"
        readOnly={awaitingResponse}
        renderOptions={this.renderAmountDropDown.bind(this)}
        type="number"
        value={value}
      />
    );
  }
  renderTopupMethodInput() {
    const { transferToupType, awaitingResponse } = this.props;
    const { value, icon, color, inputMsg } = transferToupType;
    const methodDisplayText = TYPE.bankTransferTypeRefs[value];
    return (
      <Input
        readOnly={awaitingResponse}
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.transferToupType}`}
        min="2" max="10"
        name="transferToupType"
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请选择存款方式"
        renderOptions={this.renderTransferDropDown.bind(this)}
        mouseLeaveSensitive
        value={methodDisplayText}
      />
    );
  }
  renderTopupCardRealnameInput() {
    const { topupCardRealname } = this.props;
    const { value, icon, color, inputMsg } = topupCardRealname;
    return (
      <Input
        dataColor={color}
        dataIcon={icon}
        dataMsg={inputMsg}
        label={`${TYPE.inputFieldRefs.topupCardRealname}`}
        min="2" max="10"
        name="topupCardRealname"
        onBlur={this.validateInput}
        onChange={this.onInputChange}
        pattern="[^\u0000-\u00FF]{2,10}$"
        placeholder="请输入 2-10 位中文字符"
        value={value}
      />
    );
  }
  renderTopupDateInput() {
    const { topupTime } = this.props;
    const { value } = topupTime;
    return (
      <div className={css.profile_datePicker}>
        { TYPE.inputFieldRefs.topupTime }
        <DatePicker
          allowClear={false}
          style={{ width: '100%', height: '2.25rem' }}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={this.onDateChange}
          value={value}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        />
      </div>
    );
  }
  renderBankTransferForm() {
    const { awaitingResponse } = this.props;
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          收款人资料
          <LoadingBar />
        </h4>
        { this.renderBankNameInput() }
        { this.renderBankAddressInput() }
        { this.renderBankCardNo() }
        { this.renderReceiptName() }
        <h4 className={css.profile_formLabel}>
          存款资料
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        { this.renderTopupAmountInput() } 
        { this.renderTopupMethodInput() }
        { this.renderTopupCardRealnameInput() }
        { this.renderTopupDateInput() }
      </div>
    );
  }
  renderScene() {
    const {
      merchantName, webview, paymentMethod, data, dataImg, adminBankId,
      awaitingResponse
    } = this.props;
    if (!webview && paymentMethod !== 'BANK_ONLINE' && data) {
      return this.renderQRCode();
    } else if (dataImg) {
      return this.renderImage();
    } else if (merchantName) {
      return (
        <div className={css.profile_contentBody}>
          <h4 className={css.profile_formLabel}>
            { merchantName }
            <LoadingBar isLoading={awaitingResponse} />
          </h4>
          { this.renderTopupAmountInput() }
        </div>
      );
    } else if (adminBankId) {
      return this.renderBankTransferForm();
    }
    return (
      <div className={css.profile_contentBody}>
        <h4 className={css.profile_formLabel}>
          充值
          <LoadingBar isLoading={awaitingResponse} />
        </h4>
        <p className={css.profile_reminder}>
          <MDIcon iconName="lightbulb-on-outline" />
          <i>尊敬的用户，请继续选择支付方式</i>
        </p>
      </div>
    );
  }
  render() {
    return (
      <div>
        { this.renderScene() }
        { this.renderResponseMsg() }
        { this.renderBtnRow() }
      </div>
    );
  }
}

const mapStatesToProps = ({ transferModel, formModel }) => {
  return { ...transferModel, ...formModel };
};

export default connect(mapStatesToProps)(TopUp);
