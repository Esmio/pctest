import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Column, EllipsisLoader } from '../General/';
import css from '../../styles/general/button.less';

class Button extends Component {
  renderIcon(icon) {
    const { iconAlignment, placeholder } = this.props;
    if (icon) {
      return <Column float={placeholder ? iconAlignment : 'none'}>{icon}</Column>;
    }
    return null;
  }
  render() {
    const {
      className,
      type,
      style,
      placeholder,
      onClick,
      icon,
      disabled,
      loading
    } = this.props;
    const classes = classnames(css.button, className);
    return (
      <button
        disabled={disabled || loading}
        style={style}
        className={classes}
        type={type}
        onClick={onClick}
      >
        { this.renderIcon(icon) }
        { placeholder } { loading ? <EllipsisLoader duration={3000} /> : null}
      </button>
    );
  }
}

Button.propTypes = {
  icon: PropTypes.element
};

export { Button };
