import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from '../General/';
import css from '../../styles/general/button.less';

class RedButton extends Component {
  renderIcon(icon) {
    if (icon) {
      return icon;
    }
    return null;
  }
  render() {
    const {
      type,
      className,
      style,
      placeholder,
      onClick,
      icon,
      iconAlignment,
      disabled
    } = this.props;
    const btnClasses = classnames(css.redBtn, className);
    return (
      <Button
        disabled={disabled}
        type={type}
        onClick={onClick}
        className={btnClasses}
        style={style}
        placeholder={placeholder}
        icon={icon}
        iconAlignment={iconAlignment}
      />
    );
  }
}

RedButton.propTypes = {
  icon: PropTypes.element
};

export { RedButton };
