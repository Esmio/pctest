import React, { Component } from 'react';
import { connect } from 'dva';
import { PageContainer, MDIcon } from '../General';
import css from './styles/ProfileIndex.less';

import Authentication from './Authentication';
import BankCardInfo from './UserCenter/BankCardInfo';
import BasicInfo from './UserCenter/BasicInfo';
import CommissionReport from './AgentCenter/CommissionReport';
import MemberManage from './AgentCenter/MemberManage';
import MyCashFlow from './Common/CashFlowList';
import OrderExpensesRecord from './UserCenter/OrderExpensesRecord';
import OrderRecord from './UserCenter/OrderRecord';
import AffCodeManage from './AgentCenter/AffCodeManage';
import SecurityInfo from './UserCenter/SecurityInfo';
import TeamOverallReport from './AgentCenter/TeamOverallReport';
import TopupCtrl from './UserCenter/Topup';
import TopupRecord from './UserCenter/TopupRecord';
import WinningRecord from './UserCenter/WinningRecord';
import WithdrawalCtrl from './UserCenter/Withdrawal';
import WithdrawalRecord from './UserCenter/WithdrawalRecord';

import SideNav from './SideNav';

const INITIAL_STATE = {
  selectedNav: 'basicInfo',

  previousSelectedNav: 'basicInfo',
  modalIsVisible: false
};

class UserIndex extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { ...INITIAL_STATE };

    this.authentication = <Authentication />;
    this.bankCardInfo = <BankCardInfo />;
    this.basicInfo = <BasicInfo />;
    this.commissionReport = <CommissionReport />;
    this.memberManage = <MemberManage />;
    this.myCashFlow = <MyCashFlow />;
    this.orderExpenses = <OrderExpensesRecord />;
    this.orderRecord = <OrderRecord />;
    this.affCodeManage = <AffCodeManage />;
    this.securityInfo = <SecurityInfo />;
    this.teamOverallReport = <TeamOverallReport />;
    this.topupCtrl = <TopupCtrl />;
    this.topupRecord = <TopupRecord />;
    this.winningRecord = <WinningRecord />;
    this.withdrawalCtrl = <WithdrawalCtrl />;
    this.withdrawalRecord = <WithdrawalRecord />;

    this.dispatch = this.props.dispatch.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.onAddBankClick = this.onAddBankClick.bind(this);
    this.onAutoTopupSelect = this.onAutoTopupSelect.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onBankCardSelect = this.onBankCardSelect.bind(this);
    this.onManualTopupSelect = this.onManualTopupSelect.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onNavSelect = this.onNavSelect.bind(this);
    this.onOddTopupSelect = this.onOddTopupSelect.bind(this);
  }
  componentWillMount() {
    this.bodyScrollHandler(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.shouldShowProfileModal !== nextProps.shouldShowProfileModal && 
      nextProps.shouldShowProfileModal
    ) {
      this.dispatch({ type: 'userModel/getCurrentUser' });
    }
    if (
      this.props.shouldShowProfileModal !== nextProps.shouldShowProfileModal && 
      !nextProps.shouldShowProfileModal
    ) {
      this.dispatch({
        type: 'layoutModel/initializeState',
        payload: ['profileGroupNav', 'profileExpandedNav', 'profileSelectedNav']
      });
    }
    if (this.props.profileSelectedNav !== nextProps.profileSelectedNav) {
      this.setState({ previousSelectedNav: this.props.profileSelectedNav });
    }
    if (
      this.props.shouldShowProfileModal !== nextProps.shouldShowProfileModal ||
      this.props.shouldShowAuthModel !== nextProps.shouldShowAuthModel
    ) {
      this.bodyScrollHandler(nextProps);    
    }
  }
  onModalCancel() {
    this.setState({ modalIsVisible: false });
  }
	onModalClose() {
		this.dispatch({
      type: 'layoutModel/updateState',
      payload: {
        shouldShowProfileModal: false,
        shouldShowAuthModel: false
      }
    });
	}
  onNavSelect(profileSelectedNav) {
    this.dispatch({ type: 'layoutModel/updateState', payload: { profileSelectedNav } });
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    this.dispatch({ type: 'orderModel/clearOrderDetails' });
  }
  onNavExpandClick(payload) {
    this.dispatch({ type: 'layoutModel/updateState', payload });
  }
  onAddBankClick() {
    const { userData } = this.props;
    const { realName } = userData;
    this.dispatch({
      type: 'userModel/initializeState',
      payload: ['selectedBankCardId']
    });
    this.dispatch({
      type: 'formModel/initializeState',
      payload: [
        'bankCardExist', 'bankAccountName', 'bankName', 'bankCode',
        'bankAddress', 'bankCardNo', 'remarks'
      ]
    });
    this.dispatch({
      type: 'formModel/updateState',
      payload: { bankAccountName: { value: realName } }
    });
  }
  onPaymentGroupHover(topupType) {
    this.dispatch({
      type: 'transferModel/updateState', payload: { topupType }
    });
  }
  onPaymentGroupLeave() {
    const { paymentList, adminBankId } = this.props;
    if (adminBankId) {
      this.dispatch({ type: 'transferModel/updateState', payload: { topupType: 'BANK' } });
    } else {
      const selectedPayment = _.find(paymentList, ['paymentId', this.props.paymentId]);
      if (selectedPayment) {
        const topupType = selectedPayment.type;
        this.dispatch({ type: 'transferModel/updateState', payload: { topupType } });
      }
    }
  }
  onBackClick() {
    this.onNavSelect(this.state.previousSelectedNav);
  }
  onBankCardSelect(id) {
    const { dispatch } = this.props; 
    dispatch({
      type: 'userModel/updateState',
      payload: { selectedBankCardId: id }
    });
    dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
    dispatch({ type: 'formModel/getBankCardDetails' });
  }
  onAutoTopupSelect({ paymentId, type, paymentType, merchantName, dataImg }) {
    this.initializeTopupStatus();
    this.dispatch({
      type: 'transferModel/updateState',
      payload: {
        merchantName,
        paymentId,
        paymentType,
        topupType: type,
        dataImg
      }
    });
  }
  onOddTopupSelect(oddObject) {
    this.initializeTopupStatus();
    const { adminBankId, bankCardNo, paymentKey, receiptName } = oddObject;
    this.dispatch({
      type: 'transferModel/updateState',
      payload: {
        paymentId: adminBankId,
        dataImgUrl: bankCardNo,
        merchantName: receiptName,
        paymentKey,
        paymentType: 'SCAN'
      }
    });
  }
  onManualTopupSelect(bankOption) {
    const { adminBankId } = bankOption;
    this.initializeTopupStatus();
    const neededFormData = _.pick(
      bankOption,
      ['bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks']
    );
    const formValues = _.mapValues(neededFormData, (data) => {
      return { value: data };
    });
    this.dispatch({ type: 'transferModel/updateState', payload: { adminBankId } });
    this.dispatch({ type: 'formModel/updateState', payload: { ...formValues } });
  }
  initializeTopupStatus() {
    this.dispatch({
      type: 'transferModel/initializeState',
      payload: [
        'adminBankId', 'merchantName', 'paymentId', 'paymentType', 'topupType',
        'dataImg', 'data', 'webview', 'paymentMethod', 'transactionId', 'amount',
        'paymentPlatformCode', 'dataImgUrl'
      ]
    });
    this.dispatch({
      type: 'formModel/initializeState',
      payload: [
        'bankName', 'bankCardNo', 'receiptName', 'bankAddress', 'remarks', 'responseMsg',
        'topupAmount', 'transferToupType', 'topupCardRealname', 'topupTime'
      ]
    });
  }
  bodyScrollHandler({ shouldShowProfileModal, shouldShowAuthModel }) {
    const body = document.body;
    body.style.overflow = (shouldShowProfileModal || shouldShowAuthModel) ? 'hidden' : 'auto';
  }
  logoutHandler() {
    const { dispatch } = this.props;
    dispatch({ type: 'layoutModel/updateState', payload: { shouldShowProfileModal: false } });
    dispatch({
      type: 'userModel/getUserLogout',
    });
    this.setState({ modalIsVisible: false });    
  }
  renderContent() {
    const { profileSelectedNav } = this.props;
    if (this[profileSelectedNav]) {
      return this[profileSelectedNav];
    } return null;
  }
  renderScene() {
    const {
      userData, shouldShowProfileModal, shouldShowAuthModel,
      profileSelectedNav, adminBankId, bankAccounts, selectedBankCardId,
      bankList, paymentList, paymentId
    } = this.props; 
    const sideNavProps = {
      adminBankId,
      bankAccounts,
      bankList,
      logoutHandler: this.logoutHandler,
      onAddBankClick: this.onAddBankClick,
      onAutoTopupSelect: this.onAutoTopupSelect,
      onBackClick: this.onBackClick,
      onBankCardSelect: this.onBankCardSelect,
      onManualTopupSelect: this.onManualTopupSelect,
      onNavSelect: this.onNavSelect,
      onOddTopupSelect: this.onOddTopupSelect,
      paymentId,
      paymentList,
      profileSelectedNav,
      selectedBankCardId,
      userData,
    };
    if (shouldShowAuthModel) {
      return (
        <div className={css.registerModel}>
          <Authentication />
        </div>
      );
    } else if (userData && shouldShowProfileModal) {
      return (
        <PageContainer className={css.profileModal}>
          <SideNav {...sideNavProps} />
          <div className={css.profile_content}>
            <button
              onClick={this.onModalClose.bind(this)}
              className={css.profile_popUpCloseBtn}
            >
              <i>关闭</i><MDIcon iconName="window-close" />
            </button>
            { this.renderContent() }
          </div>
        </PageContainer>
      );
    }
    return null;
  }
  render() {
    const { shouldShowProfileModal, shouldShowAuthModel } = this.props;
    if (shouldShowProfileModal || shouldShowAuthModel) {
      return (
        <div>
          <div className={css.profileModal_overlay} />
          { this.renderScene() }
        </div>
      );
    }
    return null;
  }
}

const mapStatesToProps = ({ userModel, layoutModel, transferModel }) => {
  const { userData, selectedBankCardId, bankAccounts } = userModel;
  const {
    profileGroupNav, shouldShowProfileModal,
    profileSelectedNav, profileExpandedNav, shouldShowAuthModel
  } = layoutModel;
  return {
    ...transferModel,
    bankAccounts,
    profileExpandedNav,
    profileGroupNav,
    profileSelectedNav,
    selectedBankCardId,
    shouldShowProfileModal,
    shouldShowAuthModel,
    userData,
  };
};

export default connect(mapStatesToProps)(UserIndex);

