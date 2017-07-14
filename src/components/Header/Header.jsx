import React from 'react';
import { Link } from 'dva/router';
import Navigation from './Navigation';
import Login from './Login';
import UserProfile from '../User';
import TopTray from './TopTray';
import Logo from '../../assets/image/logo2.png';
import css from '../../styles/header/header.less';

function Header() {
  return (
    <div className={css.header}>
      <TopTray />
      <div className={css.header_login}>
        <div className={css.header_row}>
          <Link className={css.header_logoAnchor} to="/">
            <img src={Logo} alt="c6logo" className={css.header_logo} />
          </Link>
          <Login />
        </div>
      </div>
      <Navigation />
      <UserProfile />
    </div>
  );
}

export default Header;
