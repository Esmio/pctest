import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import { OrangeButton } from '../General/';
import css from '../../styles/header/login.less';
import UserQuickAccessBar from './UserQuickAccessBar';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownIsVisible: false,
      modalIsVisible: false,
      thumbLoaded: false
    };
    this.dispatch = this.props.dispatch.bind(this);
    this.logoutConfirm = Modal.confirm.bind(this);   
    this.onLogOutClick = this.onLogOutClick.bind(this);
    this.onShowProfileClick = this.onShowProfileClick.bind(this);
    this.onQuickAccessClick = this.onQuickAccessClick.bind(this);
  }
  onAuthModalClick(authenticationState) {
    this.dispatch({ type: 'layoutModel/updateState', payload: { shouldShowAuthModel: true } });
    this.dispatch({ type: 'userModel/updateState', payload: { authenticationState } });
  }
  onQuickAccessClick(profileSelectedNav) {
    this.dispatch({
      type: 'layoutModel/updateState',
      payload: {
        shouldShowProfileModal: true, profileSelectedNav
      }
    });
  }
  onShowProfileClick() {
    this.dispatch({
      type: 'layoutModel/updateState',
      payload: { shouldShowProfileModal: true }
    });
  }
  onLogOutClick() {
    const { dispatch } = this.props;
    this.logoutConfirm({
      title: '请问您确定要登出吗？',
      onOk() { dispatch({ type: 'userModel/getUserLogout' }); }
    });
  }
  renderAuth() {
    const { userData } = this.props;
    if (userData) {
      const quickAccessBarProps = {
        onQuickAccessClick: this.onQuickAccessClick,
        onLogOutClick: this.onLogOutClick,
        profileModalTrigger: this.onShowProfileClick,
        username: userData.username,
      };
      return (
        <div className={css.login_body}>
          <UserQuickAccessBar {...quickAccessBarProps} />
        </div>
      );
    }
    return (
      <div className={css.login_body}>
        <OrangeButton
          onClick={this.onAuthModalClick.bind(this, 'REGISTER')}
          placeholder="注册"
          className={css.login_button}
          type="button"
        />
        <OrangeButton
          onClick={this.onAuthModalClick.bind(this, 'LOGIN')}
          placeholder="登录"
          className={css.login_button}
          type="submit"
        />
      </div>
    );
  }
  render() {
    return this.renderAuth();
  }
}

const mapStatesToProps = ({ userModel, layoutModel }) => {
  const { userData } = userModel;
  const { shouldShowAuthModel } = layoutModel;
  return { userData, shouldShowAuthModel };
};

export default connect(mapStatesToProps)(Login);
