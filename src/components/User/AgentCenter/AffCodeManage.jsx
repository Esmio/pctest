import React, { Component } from 'react';
import { connect } from 'dva';
import { type as TYPE, randomWord } from '../../../utils';
import CreateAffCodeForm from './AffCodeManage/CreateAffCodeForm';
import AffCodeList from './AffCodeManage/AffCodeList';
import css from '../styles/ProfileIndex.less';
import { MDIcon } from '../../General';

const { memberTypeRefs, inputFieldRefs } = TYPE;

class AffCodeManageIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      awaitingResponse: false,
      editTarget: '',
      formIsPristine: true,
      isCreatingNew: false,
      searchText: '',
      sorting: [],
      tooltipText: '点我复制到剪贴板',
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.generateRandomAffCode = this.generateRandomAffCode.bind(this);
    this.onAffToggle = this.onAffToggle.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onCopySuccess = this.onCopySuccess.bind(this);
    this.onCreateNewClick = this.onCreateNewClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onQuickToggle = this.onQuickToggle.bind(this);
    this.onRadioSelect = this.onRadioSelect.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
    this.onSubmitClick = this.onSubmitClick.bind(this);
    this.onToolTipVisibleChange = this.onToolTipVisibleChange.bind(this);
    this.poluteForm = this.poluteForm.bind(this);
    this.renderResponseMsg = this.renderResponseMsg.bind(this);
  }
  componentWillMount() {
    this.dispatch({ type: 'teamModel/getAffCodeList' });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.awaitingResponse !== this.props.awaitingResponse) {
      this.setState({ awaitingResponse: nextProps.awaitingResponse });
    }
    if (nextProps.affCodeList !== this.props.affCodeList) {
      this.setState({ editTarget: '', isCreatingNew: false });
    }
  }
  componentWillUnmount() {
    this.dispatch({ type: 'teamModel/initializeState', payload: ['affCodeList'] }); 
    this.dispatch({
      type: 'formModel/initializeState',
      payload: ['affCode', 'affCodeStatus', 'affCodeUrl', 'memberType', 'prizeGroup', 'responseMsg']
    }); 
  }
  onBackClick() {
    this.dispatch({
      type: 'formModel/initializeState',
      payload: ['affCode', 'affCodeStatus', 'affCodeUrl', 'memberType', 'prizeGroup', 'responseMsg']
    });    
    this.setState({ editTarget: '', isCreatingNew: false, formIsPristine: true });
  }
  onCreateNewClick() {
    this.dispatch({
      type: 'formModel/initializeState', payload: ['responseMsg', 'prizeGroup']
    });
    this.setState({ isCreatingNew: true, formIsPristine: true });
  }
  onDeleteClick() {
    const { editTarget } = this.state;
    this.dispatch({ type: 'teamModel/deleteAffCode', payload: { id: editTarget } });
  }
  onCopySuccess() { this.setState({ tooltipText: '复制成功！' }); }
  onToolTipVisibleChange() { this.setState({ tooltipText: '点我复制到剪贴板' }); }
  onRadioSelect(memberType) {
    this.poluteForm();
    this.dispatch({ type: 'formModel/updateState', payload: { memberType } });
    this.initializeForm();
  }
  onRangeChange(event) {
    this.poluteForm();    
    event.persist();
    const eventTarget = event.target;
    const { value, name } = eventTarget;
    const payload = { [name]: { value } };
    this.dispatch({
      type: 'formModel/updateState', payload
    });
    this.initializeForm();
  }
  onAffToggle() {
    this.poluteForm();    
    const { affCodeStatus } = this.props;
    const { value } = affCodeStatus;
    let payload = { affCodeStatus: { value: 'ON' } };
    if (value === 'ON') {
      payload = { affCodeStatus: { value: 'OFF' } };
    }
    this.dispatch({ type: 'formModel/updateState', payload });
    this.initializeForm();
  }
  onInputChange(event) {
    this.poluteForm();    
		event.persist();
    const eventTarget = event.target;
    const { value, max, name } = eventTarget;
    const { dispatch } = this.props;
    const payload = { [name]: { value } };
    if (`${value}`.length <= max) {
      dispatch({
        type: 'formModel/updateState', payload
      });
    }
    this.initializeForm();
  }
  onSubmitClick() {
    const { editTarget, isCreatingNew } = this.state;
    if (editTarget) {
      this.dispatch({ type: 'teamModel/putAffCode', payload: { id: editTarget } });      
    } else if (isCreatingNew) {
      this.dispatch({ type: 'teamModel/postAffCode' }); 
    }
  }
  onEditClick(permalink) {
    this.dispatch({
      type: 'formModel/initializeState', payload: ['responseMsg']
    });
    this.setState({ formIsPristine: true });
    
    const { affCode, url, memberType, prizeGroup, status, id } = permalink;
    const payload = {
      affCode: { value: affCode },
      affCodeStatus: { value: status },
      affCodeUrl: { value: url },
      memberType,
      prizeGroup: { value: prizeGroup },
    };
    this.dispatch({ type: 'formModel/updateState', payload });
    this.setState({ editTarget: id });
  }
  onQuickToggle(permalink) {
    const { affCode, url, memberType, prizeGroup, status, id } = permalink;
    let newStatus = 'ON';
    if (status === 'ON') {
      newStatus = 'OFF';
    }
    const payload = {
      affCode: { value: affCode },
      affCodeStatus: { value: newStatus },
      affCodeUrl: { value: url },
      memberType,
      prizeGroup: { value: prizeGroup },
    };
    this.dispatch({ type: 'formModel/updateState', payload });
    this.dispatch({ type: 'teamModel/putAffCode', payload: { id } });
  }
  poluteForm() {
    this.setState({ formIsPristine: false });
  }
  validateInput(payload) {
    this.dispatch({ type: 'formModel/validateInput', payload });
  }
  initializeForm() {
    this.dispatch({ type: 'formModel/initializeState', payload: ['responseMsg'] });
  }
  generateRandomAffCode() {
    this.poluteForm();
    const affCode = randomWord(true, 4, 16);
    this.dispatch({
      type: 'formModel/updateState',
      payload: {
        affCode: { value: affCode }
      }
    });
    this.initializeForm();    
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
  renderForm() {
    const { isCreatingNew, formIsPristine, editTarget } = this.state;
    const {
      affCode, affCodeStatus, userData, prizeGroup, memberType
    } = this.props;
    const formProps = {
      affCode,
      affCodeStatus,
      awaitingResponse: this.awaitingResponse,
      dispatch: this.dispatch,
      editTarget,
      formIsPristine,
      generateRandomAffCode: this.generateRandomAffCode,
      inputFieldRefs,
      isCreatingNew,
      memberType,
      onAffToggle: this.onAffToggle,
      onBackClick: this.onBackClick,
      onDeleteClick: this.onDeleteClick,
      onInputChange: this.onInputChange,
      onRadioSelect: this.onRadioSelect,
      onRangeChange: this.onRangeChange,
      onSubmitClick: this.onSubmitClick,
      poluteForm: this.poluteForm,
      prizeGroup,
      renderResponseMsg: this.renderResponseMsg,
      userData,
      validateInput: this.validateInput,
    };
    return <CreateAffCodeForm {...formProps} />;
  }
  renderList() {
    const { awaitingResponse, tooltipText } = this.state;
    const { affCodeList } = this.props;
    const listProps = {
      affCodeList,
      awaitingResponse,
      memberTypeRefs,
      dispatch: this.dispatch,
      onCopySuccess: this.onCopySuccess,
      onCreateNewClick: this.onCreateNewClick,
      onEditClick: this.onEditClick,
      onQuickToggle: this.onQuickToggle,
      onToolTipVisibleChange: this.onToolTipVisibleChange,
      renderResponseMsg: this.renderResponseMsg,
      tooltipText,
    };
    return <AffCodeList {...listProps} />;
  }
  render() {
    const { isCreatingNew, editTarget } = this.state;
    if (isCreatingNew || editTarget) {
      return this.renderForm();
    }
    return this.renderList();
  }
}
const mapStateToProps = ({ teamModel, userModel, formModel, dataTableModel }) => {
  const { userData } = userModel;
  return { userData, ...teamModel, ...formModel, ...dataTableModel };
};

export default connect(mapStateToProps)(AffCodeManageIndex);
