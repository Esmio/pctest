import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import MemberInfoForm from './MemberManage/MemberInfoForm';
import MemberList from './MemberManage/MemberList';
import TransferForm from './MemberManage/TransferForm';
import MemberDetail from '../Common/CashFlowList';
import { type as TYPE } from '../../../utils';
import { MDIcon } from '../../General';
import css from '../styles/ProfileIndex.less';

const { memberTypeRefs, inputFieldRefs } = TYPE;
const INITIAL_STATE = {
  applyTarget: '',
  previousPage: 1,
  currentList: [],
  formIsPristine: true,
  initialMemberType: '',
  initialMinRange: 0,
  isCreatingNew: false,
  mode: 'LIST',
  routes: [],
  sorting: '',
  sortingTarget: '',
};
// @mode: LIST || CREATE || EDIT || TRANSFER || DETAIL

class MemberManageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.dispatch = this.props.dispatch.bind(this);
    this.awaitingResponse = false;
    this.initializeState = this.initializeState.bind(this);
    this.onAgentClick = this.onAgentClick.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onBreadcrumClick = this.onBreadcrumClick.bind(this);
    this.onCreateNewClick = this.onCreateNewClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onInitialListClick = this.onInitialListClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onPageSizeChange = this.onPageSizeChange.bind(this);
    this.onRadioSelect = this.onRadioSelect.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchClear = this.onSearchClear.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.renderResponseMsg = this.renderResponseMsg.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.onTransferClick = this.onTransferClick.bind(this);
    this.onDetailClick = this.onDetailClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.awaitingResponse !== nextProps.awaitingResponse) {
      this.awaitingResponse = nextProps.awaitingResponse;
    }
    if (this.props.memberList !== nextProps.memberList) {
      this.initializeState(['mode', 'applyTarget', 'formIsPristine']);
    }
  }
  componentWillUnmount() {
    this.dispatch({
      type: 'dataTableModel/initializeState',
      payload: ['targetUser', 'pageSize', 'currentPage']
    });
    this.dispatch({
      type: 'teamModel/initializeState',
      payload: ['usernameSearchString', 'memberList', 'agentId']
    });
  }
  onInitialListClick() {
    const { pageSize } = this.props;
    const { previousPage } = this.state;
    this.setState({ routes: [] });
    const start = (previousPage - 1) * pageSize;
    this.dispatch({
      type: 'dataTableModel/updateState', payload: { currentPage: previousPage, start }
    });
    this.dispatch({ type: 'teamModel/initializeState', payload: ['agentId'] });
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  onBackClick() {
    this.initializeState(['applyTarget', 'mode', 'formIsPristine', 'initialMinRange']);
  }
  onCreateNewClick() {
    this.dispatch({
      type: 'formModel/initializeState', payload: ['responseMsg']
    });
    this.dispatch({
      type: 'formModel/updateState',
      payload: { password: { value: '123456' } }
    });
    this.setState({ mode: 'CREATE' });
    this.initializeState(['formIsPristine']);
  }
  onEditClick(member) {
    const { username, memberType, prizeGroup } = member;
    const { currentPage } = this.props;
    this.setState({
      applyTarget: username,
      initialMinRange: prizeGroup,
      initialMemberType: memberType,
      mode: 'EDIT',
      previousPage: currentPage
    });
    this.dispatch({
      type: 'formModel/updateState',
      payload: { 
        memberType,
        username: { value: username },
        prizeGroup: { value: prizeGroup }
      }
    });
  }
  onTransferClick({ username }) {
    this.setState({ mode: 'TRANSFER', applyTarget: username });
    this.dispatch({
      type: 'formModel/updateState',
      payload: { 
        username: { value: username },
      }
    });
  }
  onDetailClick({ username }) {
    const { currentPage } = this.props;
    this.dispatch({
      type: 'dataTableModel/initializeState', payload: ['currentPage', 'start']
    });
    this.dispatch({
      type: 'dataTableModel/updateState',
      payload: { targetUser: username }
    });
    this.setState({
      mode: 'DETAIL',
      previousPage: currentPage,
      applyTarget: username,
    });
  }
  onInputChange(event) {
    this.poluteForm();
		event.persist();
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      this.dispatch({
        type: 'formModel/updateState', payload
      });
    }
  }
  onRangeChange(event) {
    this.poluteForm();
    const { isCreatingNew, initialMinRange } = this.state;
    event.persist();
    const eventTarget = event.target;
    const { value, name } = eventTarget;
    let min = initialMinRange;
    if (isCreatingNew) {
      min = 0;
    }
    let payload = { [name]: { value } };
    if (value < min) {
      payload = { [name]: { value: min } };
    }
    this.dispatch({
      type: 'formModel/updateState', payload
    });
  }
  onRadioSelect(memberType) {
    this.poluteForm();
    this.dispatch({ type: 'formModel/updateState', payload: { memberType } });
  }
  onSubmitClick() {
    const { applyTarget, mode } = this.state;
    if (applyTarget) {
      this.dispatch({ type: 'teamModel/putUserInfo' });
    } else if (mode === 'CREATE') {
      this.dispatch({ type: 'teamModel/postUser' });
    }
  }
  onSearchChange(event) {
    if (event.target) {
      const { value } = event.target;
      this.dispatch({ type: 'teamModel/updateState', payload: { usernameSearchString: value } });
    }
  }
  onSearchClear() {
    this.dispatch({ type: 'teamModel/initializeState', payload: ['usernameSearchString'] });
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  onSearchClick() { this.dispatch({ type: 'teamModel/getMemberList' }); }
  onPageSizeChange(currentPage, pageSize) {
    this.dispatch({ type: 'dataTableModel/updateState', payload: { pageSize, currentPage } });
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  onPageChange(currentPage, pageSize) {
    const start = (currentPage - 1) * pageSize;
    this.dispatch({ type: 'dataTableModel/updateState', payload: { start, currentPage } });
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  onAgentClick({ userId, username }) {
    const { routes } = this.state;
    const { currentPage } = this.props;
    const newRoutes = [...routes, { userId, username }];
    this.setState({ routes: newRoutes, previousPage: currentPage });
    this.dispatch({ type: 'teamModel/updateState', payload: { agentId: userId } });
    this.dispatch({
      type: 'dataTableModel/initializeState', payload: ['currentPage', 'start']
    });
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  onBreadcrumClick({ userId, index }) {
    const { routes } = this.state;
    const newRoutes = [...routes].slice(0, index + 1);
    this.setState({ routes: newRoutes });
    this.dispatch({ type: 'teamModel/updateState', payload: { agentId: userId } });
    this.dispatch({ type: 'teamModel/getMemberList' });
  }
  initializeState(targets) {
    const initialStates = _.pick(INITIAL_STATE, targets);
    this.setState({ ...initialStates });
  }
  validateUsername(payload) {
    this.dispatch({ type: 'formModel/getUsernameExistState', payload });
	}
  validateInput(payload) {
    this.dispatch({ type: 'formModel/validateInput', payload });
  }
  poluteForm() {
    this.setState({ formIsPristine: false });
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
  renderList() {
    const { routes, applyTarget } = this.state;
    const {
      memberListLength, currentPage, pageSize, usernameSearchString,
      agentId, memberList
    } = this.props;
    const listProps = {
      agentId,
      applyTarget,
      currentPage,
      dispatch: this.dispatch,
      initializeParentState: this.initializeState,
      memberList,
      memberListLength,
      memberTypeRefs,
      onAgentClick: this.onAgentClick,
      onBackClick: this.onBackClick,
      onBreadcrumClick: this.onBreadcrumClick,
      onCreateNewClick: this.onCreateNewClick,
      onDetailClick: this.onDetailClick,
      onEditClick: this.onEditClick,
      onInitialListClick: this.onInitialListClick,
      onInputChange: this.onInputChange,
      onPageChange: this.onPageChange,
      onPageSizeChange: this.onPageSizeChange,
      onRadioSelect: this.onRadioSelect,
      onRangeChange: this.onRangeChange,
      onSearchChange: this.onSearchChange,
      onSearchClear: this.onSearchClear,
      onSearchClick: this.onSearchClick,
      onSubmitClick: this.onSubmitClick,
      onTransferClick: this.onTransferClick,
      pageSize,
      renderResponseMsg: this.renderResponseMsg,
      routes,
      usernameSearchString,
      validateInput: this.validateInput,
      validateUsername: this.validateUsername,
    };
    return <MemberList {...listProps} />;
  }
  renderTransferForm() {
    const { applyTarget } = this.state;
    const {
      username, securityPassword, transferAmount, dailyWithdrawWithAdminSettingsResult
    } = this.props;
    const formProps = {
      applyTarget,
      awaitingResponse: this.awaitingResponse,
      dailyWithdrawWithAdminSettingsResult,
      dispatch: this.props.dispatch,
      inputFieldRefs,
      onBackClick: this.onBackClick,
      renderResponseMsg: this.renderResponseMsg,
      securityPassword,
      transferAmount,
      username,
    };
    return <TransferForm {...formProps} />;
  }
  renderMemberDetails() {
    const detailProps = {
      onBackClick: this.onBackClick,
      onInitialListClick: this.onInitialListClick      
    };
    return <MemberDetail {...detailProps} />;
  }
  renderMemberInfoForm() {
    const {
      username, userData, prizeGroup, memberType, password
    } = this.props;
    const {
      isCreatingNew, applyTarget, formIsPristine, initialMinRange, initialMemberType, mode, 
    } = this.state;
    const formProps = {
      applyTarget,
      awaitingResponse: this.awaitingResponse,
      dispatch: this.dispatch,
      formIsPristine,
      initializeParentState: this.initializeState,
      initialMemberType,
      initialMinRange,
      inputFieldRefs,
      isCreatingNew,
      memberType,
      mode,
      onBackClick: this.onBackClick,
      onInputChange: this.onInputChange,
      onRadioSelect: this.onRadioSelect,
      onRangeChange: this.onRangeChange,
      onSubmitClick: this.onSubmitClick,
      password,
      prizeGroup,
      renderResponseMsg: this.renderResponseMsg,
      userData,
      username,
      validateInput: this.validateInput,
      validateUsername: this.validateUsername,
    };
    return <MemberInfoForm {...formProps} />;
  }
  render() {
    const { mode } = this.state;
    switch (mode) {
      case 'CREATE':
        return this.renderMemberInfoForm();
      case 'EDIT':
        return this.renderMemberInfoForm();
      case 'TRANSFER':
        return this.renderTransferForm();
      case 'DETAIL':
        return this.renderMemberDetails();
      default:
        return this.renderList();
    }
  }
}

const mapStateToProps = ({ teamModel, dataTableModel, userModel, formModel }) => {
  const { userData, dailyWithdrawWithAdminSettingsResult } = userModel;
  return {
    ...teamModel,
    ...dataTableModel,
    ...formModel,
    userData,
    dailyWithdrawWithAdminSettingsResult
  };
};

export default connect(mapStateToProps)(MemberManageIndex);
