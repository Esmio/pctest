import React, { Component } from 'react';
import { MDIcon } from '../General';
import css from './styles/GameNav.less';

class GameSubNav extends Component {
  renderSubnav() {
    const { onMethodSelect, gameSubNav } = this.props;
    return _.map(gameSubNav, (method) => {
      const { methodId, gameMethod } = method;
      if (gameMethod) {
        const nameArray = _.split(method.gameMethod, '-');
        const displayName = nameArray[1] || nameArray[0];
        const buttonActive =
          gameMethod === this.props.gameMethod &&
          methodId === this.props.methodId;
        return (
          <button
            key={gameMethod} className={css.gameSubnav_btn}
            onClick={onMethodSelect.bind(this, method)}
            data-active={buttonActive}
          >
            { displayName }
          </button>
        );
      } return null;
    });
  }
  render() {
    return (
      <div className={css.gameSubnavs}>
        { this.renderSubnav() }
      </div>
    );
  }
}

export default GameSubNav;
