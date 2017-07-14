import React, { Component } from 'react';
import _ from 'lodash';
import { Popconfirm } from 'antd';

import css from './styles/ProfileIndex.less';
import { MDIcon } from '../General';
import { type as TYPE } from '../../utils';

const { userProfileNavs } = TYPE;
const { userCenter, agentCenter } = userProfileNavs;

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedNavs: [],
      expandedPayments: ''
    };
    this.onNavSelectHandler = this.onNavSelectHandler.bind(this);
    this.expandInitialGroup = this.expandInitialGroup.bind(this);
    this.onPaymentGroupToggle = this.onPaymentGroupToggle.bind(this);
    this.onBackClickHandler = this.onBackClickHandler.bind(this);
    this.onOddTopupSelect = this.props.onOddTopupSelect.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.paymentId !== nextProps.paymentId &&
      nextProps.paymentId && !this.state.expandedPayments
    ) {
      this.expandInitialGroup(nextProps);
    }
  }
  onNavSelectHandler({ subNavs, navKey }) {
    const { onNavSelect } = this.props;
    const { expandedNavs } = this.state;
    const expandedNavsIndex = expandedNavs.indexOf(navKey);
    const newExpandedNavs = [...expandedNavs];
    let selectedKey = navKey;
    if (subNavs && expandedNavsIndex > -1) {
      newExpandedNavs.splice(expandedNavsIndex, 1);
    } else {
      newExpandedNavs.push(navKey);
    }
    if (subNavs && subNavs.length) {
      selectedKey = subNavs[0].navKey;
      this.setState({ expandedNavs: newExpandedNavs });      
    } else {
      onNavSelect(selectedKey);
    }
  }
  onPaymentGroupToggle({ paymentKey }) {
    if (this.state.expandedPayments === paymentKey) {
      this.setState({ expandedPayments: '' });
    } else {
      this.setState({ expandedPayments: paymentKey });      
    }
  }
  onBackClickHandler() {
    const { onBackClick } = this.props;
    this.setState({ expandedPayments: '' });
    onBackClick();
  }
  expandInitialGroup({ paymentId, paymentList }) {
    const payment = _.find(paymentList, ['paymentId', paymentId]);
    const { type } = payment;
    if (type) {
      this.onPaymentGroupToggle({ paymentKey: type });
    }
  }
  renderBankCards() {
    const { bankAccounts, selectedBankCardId, onBankCardSelect } = this.props;
    if (bankAccounts.length > 0) {
      return (
        _.map(bankAccounts, (bankCard) => {
          const { bankName, bankCardNo, id } = bankCard;
          const bankInfo = _.find(TYPE.banksOptions, ['displayName', bankName]);
          let website = 'www.null';
          if (bankInfo) {
            website = bankInfo.website;
          }
          const btnActive = selectedBankCardId === id;
          const btnProps = {
            key: id,
            disabled: btnActive,
            'data-active': btnActive,
            onClick: onBankCardSelect.bind(this, id),
            className: css.profile_bankCard
          };
          const cardFourDigit = bankCardNo.substring(bankCardNo.length - 4, bankCardNo.length);
          return (
            <button {...btnProps}>
              <img
                className={css.profile_bankFavicon} height="18px" width="18px"
                src={`http://www.google.com/s2/favicons?domain=${website}`} alt={bankName}
              />
              <span className={css.profile_bankName}>
                {bankName} - <strong>{ cardFourDigit }</strong>
              </span>
            </button>
          );
        })
      );
    }
    return (
      <p className={css.profile_emptyListMsg}>尚未添加银行卡</p>
    );
  }
  renderAutoPayListItem({
    paymentKey, paymentName, list, navIsActive
  }) {
    const { onAutoTopupSelect } = this.props;
    return (
      <div key={paymentKey}>
        <button
          onClick={this.onPaymentGroupToggle.bind(this, { paymentKey })}
          className={css.profile_sideNavBtn} data-expanded={navIsActive}
        >
          <i className={css[`profile_paymentIcon__${paymentKey}_PAY`]} />
          <i className={css.profile_sideNavBtnText}>{ paymentName }</i>
          <MDIcon iconName="chevron-down" />
        </button>
        <div className={css.profile_sideSubNavs} data-expanded={navIsActive}>
          {
            _.map(list, (option) => {
              const {
                paymentId, merchantName, bankCode, receiptName, adminBankId, paymentType
              } = option;
              const isOddItem = bankCode === 'ZHB' || bankCode === 'WX';
              const notWAP = paymentType !== 'WAP' && bankCode !== 'WAP';
              const btnActive =
                adminBankId === this.props.paymentId ||
                paymentId === this.props.paymentId;
              if (isOddItem) {
                const isQQ = receiptName.indexOf('qq') > -1;
                return (
                  <button
                    key={paymentId || adminBankId}
                    onClick={this.onOddTopupSelect.bind(this, { ...option, paymentKey })}
                    disabled={btnActive}
                    data-active={btnActive}
                    className={css.profile_sideNavBtn} 
                  >
                    {isQQ ? <MDIcon iconName="qqchat" /> : null}
                    <i className={css.profile_sideNavBtnText}>{receiptName}</i>
                  </button>
                );
              } else if (notWAP) {
                const isQQ = merchantName.indexOf('qq') > -1;
                
                return (
                  <button
                    key={paymentId || adminBankId}
                    onClick={onAutoTopupSelect.bind(this, option)}
                    disabled={btnActive}
                    data-active={btnActive}                     
                    className={css.profile_sideNavBtn}
                  >
                    {isQQ ? <MDIcon iconName="qqchat" /> : null}
                    <i className={css.profile_sideNavBtnText}>{ merchantName }</i>
                  </button>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
  renderManualPayListItem({
    paymentKey, paymentName, list, navIsActive
  }) {
    const { onManualTopupSelect } = this.props;
    return (
      <div key={paymentKey}>
        <button
          onClick={this.onPaymentGroupToggle.bind(this, { paymentKey })}
          className={css.profile_sideNavBtn} data-expanded={navIsActive}
        >
          <i className={css[`profile_paymentIcon__${paymentKey}_PAY`]} />
          <i className={css.profile_sideNavBtnText}>{ paymentName }</i>
          <MDIcon iconName="chevron-down" />
        </button>
        <div className={css.profile_sideSubNavs} data-expanded={navIsActive}>
          {
            _.map(list, (option) => {
              const { bankName, adminBankId, receiptName, bankCode } = option;
              const isOddItem = bankCode === 'ZHB' || bankCode === 'WX';
              const btnProps = {
                key: adminBankId,
                className: css.profile_sideNavBtn,
                'data-active': adminBankId === this.props.adminBankId,
                onClick: onManualTopupSelect.bind(this, option)
              };
              if (isOddItem) return null;
              return (
                <button {...btnProps}>
                  <span>{bankName}</span><br />
                  <em className={css.profile_sideNavBtnText}>{ receiptName }</em>
                </button>
              );
            })
          }
        </div>
      </div>
    );
  }
  renderTopupList() {
    const { paymentTypeRefs } = TYPE;
    const { paymentList, bankList } = this.props;
    const { expandedPayments } = this.state;
    
    return _.map(paymentTypeRefs, (paymentName, paymentKey) => {
      const list = _.filter(paymentList, ['type', paymentKey]);
      const oddObjects = _.filter(bankList, ['bankCode', paymentKey]);
      const completeList = [...list, ...oddObjects];
      const navIsActive = expandedPayments === paymentKey;
      if (paymentKey === 'BANK') {
        return this.renderManualPayListItem({
          paymentName, paymentKey, list: bankList, navIsActive
        });
      }
      return this.renderAutoPayListItem({
        paymentName, paymentKey, list: completeList, navIsActive
      });
    });
  }
  renderSecondaryList() {
    const { profileSelectedNav, onAddBankClick } = this.props;
    switch (profileSelectedNav) {
      case 'bankCardInfo':
        return (
          <div
            data-visible={profileSelectedNav === 'bankCardInfo'}
            className={css.profile_secondaryList}
          >
            <button className={css.profile_listBackBtn} onClick={this.onBackClickHandler}>
              <MDIcon iconName="keyboard-backspace" /><i>返回</i>
            </button>
            { this.renderBankCards() }
            <button
              className={css.profile_listAddCardBtn}
              onClick={onAddBankClick.bind(this)}
            >
              <MDIcon iconName="credit-card-plus" />
              <i>添加银行卡</i>
            </button>
          </div>
        );
      case 'topupCtrl':
        return (
          <div
            className={css.profile_secondaryList}
            data-visible={profileSelectedNav === 'topupCtrl'}            
          >
            <button className={css.profile_listBackBtn} onClick={this.onBackClickHandler}>
              <MDIcon iconName="keyboard-backspace" /><i>返回</i>
            </button>
            { this.renderTopupList() }
          </div>
        );
      default:
        return (
          <div className={css.profile_secondaryList} />
        );
    }
  }
  renderNavs(navs) {
    const { profileSelectedNav, userData } = this.props;
    const isGuest = userData.username.indexOf('guest') > -1;
    const { expandedNavs } = this.state;
    return _.map(navs, (nav) => {
      if (isGuest && nav.notForGuest) return null;
      const { subNavs, disabled } = nav;
      const activeNav = _.find(subNavs, ['navKey', profileSelectedNav]);
      const navExpanded = activeNav !== undefined || expandedNavs.indexOf(nav.navKey) > -1;
      const navProps = {
        className: css.profile_sideNavBtn,
        onClick: this.onNavSelectHandler.bind(this, nav),
        'data-active': profileSelectedNav === nav.navKey,
        'data-expanded': navExpanded,
        disabled
      };
      const subNavsProps = {
        'data-expanded': navExpanded,
         className: css.profile_sideSubNavs
      };
      return (
        <div key={nav.navKey}>
          <button {...navProps}>
            <MDIcon iconName={nav.icon} />
            <i className={css.profile_sideNavBtnText}>{ nav.displayName }</i>
            { subNavs ? <MDIcon iconName="chevron-down" /> : null }
          </button>
          <div {...subNavsProps}>
            { subNavs ?
              _.map(subNavs, (subNav) => {
                if (isGuest && subNav.notForGuest) return null;
                const subNavProps = {
                  'data-active': profileSelectedNav === subNav.navKey,
                  key: subNav.navKey,
                  onClick: this.onNavSelectHandler.bind(this, subNav),
                  className: css.profile_sideNavBtn
                };
                return (
                  <button {...subNavProps}>
                    <i className={css.profile_sideNavBtnText}>{ subNav.displayName }</i>
                  </button>
                );
              }) : null
            }
          </div>
        </div>
      );
    });
  }
  render() {
    const { userData, logoutHandler } = this.props;
    const { nickname, username, role } = userData;
    const isAgent = role === 'AGENT';
    const name = nickname || username;   
    return (
      <div
        className={css.profile_sideNav}
      >
        <div className={css.profile_sideNavGroup}>
          <h6 className={css.profile_sideNavLabel}>用户中心</h6>
          { this.renderNavs(userCenter) }
        </div>
        {
          isAgent ? 
          <div className={css.profile_sideNavGroup}>
            <h6 className={css.profile_sideNavLabel}>代理中心</h6>
            { this.renderNavs(agentCenter) }
          </div> : null
        }
        { this.renderSecondaryList() }
        <Popconfirm
          title={`${name}您确定登出?`}
          okText="确定" cancelText="取消"
          onConfirm={logoutHandler}
        >
          <button
            className={css.profile_logoutBtn}
          >登出</button>
        </Popconfirm>
      </div>
    );
  }
}

export default SideNav;
