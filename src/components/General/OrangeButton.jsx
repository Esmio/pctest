import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from '../../styles/general/button.less';
import { Button } from '../General';

class OrangeButton extends Component {
  renderIcon(icon) {
    if (icon) {
      return icon;
    }
    return null;
  }
  render() {
    const {
      type,
      style,
      className,
      placeholder,
      onClick,
      icon,
      disabled,
      iconAlignment,
      loading
    } = this.props;
    const classes = classnames(css.orangeBtn, className);
    return (
      <Button
        loading={loading}
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={style}
        className={classes}
        placeholder={placeholder}
        icon={icon}
        iconAlignment={iconAlignment}
      />
    );
  }
}

OrangeButton.propTypes = {
  icon: PropTypes.element
};

export { OrangeButton };
