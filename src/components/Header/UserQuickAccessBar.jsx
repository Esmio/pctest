import React from 'react';
import { MDIcon } from '../General';
import css from '../../styles/header/login.less';

class UserQuickAccessBar extends React.Component {
  constructor(props) {
    super(props);
    this.isGuest = props.username.indexOf('guest') > -1;
    this.onQuickAccessClick = this.props.onQuickAccessClick;
  }
  componentWillReceiveProps(nextProps) {
    this.isGuest = nextProps.username.indexOf('guest') > -1;
  }
  render() {
    // const userInitial = this.props.username.substr(0, 1);
    // const backgroundUrl = `https://dummyimage.com/48x48/106ddc/ffffff.png&text=${userInitial}`;

    return (
      <div
        onClick={this.handleClick}
        className={css.quickAccessBar}
      >
        <button
          className={css.quickAccessBarBtn}
          onClick={this.onQuickAccessClick.bind(this, 'orderRecord')}
        >
          <MDIcon iconName="ticket-confirmation" /><i>投注记录</i>
        </button>
        <button
          className={css.quickAccessBarBtn}
          onClick={this.onQuickAccessClick.bind(this, 'myCashFlow')}
        >
          <MDIcon iconName="format-list-checks" /><i>账户明细</i>
        </button>
        <button
          disabled={this.isGuest}
          className={css.quickAccessBarBtn}
          onClick={this.onQuickAccessClick.bind(this, 'topupCtrl')}
        >
          <MDIcon iconName="bank" /><i>充值</i>
        </button>
        <button
          disabled={this.isGuest}
          className={css.quickAccessBarBtn}
          onClick={this.onQuickAccessClick.bind(this, 'withdrawalCtrl')}
        >
          <MDIcon iconName="cash-multiple" /><i>提款</i>
        </button>
        <button
          className={css.login_profileTriggerBtn}
          onClick={this.props.profileModalTrigger}
        >
          <span
            className={css.login_userProfileLinkIcon}  
          >
            <MDIcon iconName="face-profile" />
          </span>          
          <i>用户中心</i>
        </button>
        <button className={css.quickAccessBarBtn} onClick={this.props.onLogOutClick}>
          <MDIcon iconName="power" /><i>安全登出</i>
        </button>
      </div>
    );
  }
}

export default UserQuickAccessBar;
