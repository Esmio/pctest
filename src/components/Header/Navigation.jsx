import React, { Component } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { PageContainer } from '../General';
import css from '../../styles/header/navigation.less';

class Navigation extends Component {
  toggleSideNav() {
    const { dispatch, shouldShowSideNav } = this.props;
    dispatch({ type: 'layoutModel/setSideNavVisibility', payload: !shouldShowSideNav });
  }
  render() {
    const { shouldShowSideNav, sideNavIsLocked, pathname } = this.props;
    const sideNavParentClass = shouldShowSideNav ?
    css.navigation_sideNavParent__showSideNav : css.navigation_sideNavParent;
    return (
      <div className={css.navigation}>
        <PageContainer className={css.navigation_body}>
          { pathname === '/' ?
            <div className={sideNavParentClass}>
              <button
                className={css.navigation_sideNavToggleBtn}
                disabled={sideNavIsLocked}
                onClick={this.toggleSideNav.bind(this)}
              >
                选择彩种
              </button>
            </div> : null
          }
          <div className={css.navigation_list}>
            {
              navList.map((navItem) => {
                const { navText, disabled } = navItem;
                return (
                  <div
                    className={css.navigation_listItem}
                    key={navText}
                  >
                    <Link to={navItem.pathname} disabled={disabled}>
                      <button
                        data-active={pathname === navItem.pathname}
                        className={css.navigation_button}
                      >
                        {navText}
                      </button>
                    </Link>
                  </div>
                );
              })
            }
          </div>
        </PageContainer>
      </div>
    );
  }
}

const mapStatesToProps = ({ layoutModel, routing }) => {
  const { locationBeforeTransitions } = routing;
  const { pathname } = locationBeforeTransitions;
  const { activeTab, shouldShowSideNav, sideNavIsLocked } = layoutModel;
  return { activeTab, shouldShowSideNav, sideNavIsLocked, pathname };
};

export default connect(mapStatesToProps)(Navigation);

const navList = [
  { navText: '首页', pathname: '/' },
  { navText: '购彩大厅', pathname: '/betcenter' },
  { navText: '手机购彩', pathname: '/m' },
  { navText: '优惠活动', pathname: '/specialoffer', disabled: true },
  { navText: '开奖历史', pathname: '/history' },
  { navText: '走势图表', pathname: '/trendpage' },
];
