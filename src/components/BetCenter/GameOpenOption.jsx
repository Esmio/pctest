import React, { Component } from 'react';
import _ from 'lodash';
import { MDIcon } from '../General';
import { cleanEmptyObj } from '../../utils';
import css from './styles/GameBoard.less';

class GameOpenOption extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.dispatch = this.props.dispatch.bind(this);
  }
  onBtnClick(option) {
    const { methodId, thisOpenOption, allOpenOptions } = this.props;
    let newAllOpenOptions = { ...allOpenOptions };
    const newOpenOptions = [...thisOpenOption];
    if (newOpenOptions.length) {
      const opetionIndex = newOpenOptions.indexOf(option);
      if (opetionIndex > -1) {
        newOpenOptions.splice(opetionIndex, 1);
      } else {
        newOpenOptions.push(option);
      }
    } else {
      newOpenOptions.push(option);
    }
    newAllOpenOptions[methodId] = newOpenOptions;
    newAllOpenOptions = cleanEmptyObj(newAllOpenOptions);
    this.dispatch({
      type: 'betCenter/updateState', payload: { allOpenOptions: newAllOpenOptions }
    });
  }
  renderScene({ gameRules }) {
    const { thisOpenOption } = this.props;
    if (_.isArray(gameRules.openOptions)) {
      const { openOptions } = gameRules;
      return _.map(openOptions, (option) => {
        const btnIsActive = thisOpenOption.indexOf(option) > -1;
        const iconName = btnIsActive ? 'checkbox-marked-circle' : 'checkbox-blank-circle';
        const btnProps = {
          className: css.gameOpenOption,
          'data-active': btnIsActive,
          key: option,
          onClick: this.onBtnClick.bind(this, option)
        };
        return (
        <button {...btnProps}>
          <MDIcon iconName={iconName} />
          <i>{ option }</i>
        </button>
        );
      });
    } return null;
  }
  render() {
    const { thisMethodSetting } = this.props;
    if (thisMethodSetting) {
      return (
        <div className={css.gameOpenOptions}>
          { this.renderScene(thisMethodSetting) }
        </div>
      );
    } return null;
  }
}

export default GameOpenOption;
