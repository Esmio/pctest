import React, { Component } from 'react';

import { LoadingBar } from '../General';
import css from './styles/GameNav.less';

class GameNav extends Component {
  renderNav() {
    const { methodGroup, gameNav, onNavSelect } = this.props;
    if (gameNav.length) {
      return _.map(gameNav, (navName) => {
        const btnActive = navName === methodGroup;
        return (
          <button
            onClick={onNavSelect.bind(this, navName)}
            key={navName} className={css.gameNav_btn}
            data-active={btnActive} disabled={btnActive}
          >
            {navName}
          </button>
        );
      });
    } return null;
  }
  render() {
    const { gameNav } = this.props;
    return (
      <div className={css.gameNav}>
        <LoadingBar isLoading={!gameNav.length} style={{ margin: 0 }} />
        <div className={css.gameNav_btns}>
          { this.renderNav() }
        </div>
      </div>
    );
  }
}

export default GameNav;
