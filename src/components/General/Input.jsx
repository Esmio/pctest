import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Row, Column } from '../General/';
import css from '../../styles/general/input.less';
import { newStyle } from '../../utils';

export function Input({
  className,
  hasErr,
  inputMsg,
  leftIcon,
  max,
  msgIcon,
  name,
  onBlur,
  onChange,
  onClick,
  placeholder,
  style,
  type,
  value,
  width,
}) {
  const msgWrapperClasses = classnames(
      css.input_msg,
      hasErr ? css.input_msg__error : css.input_msg__success,
    );
  const msgWrapperStyles = newStyle(
    inputMsg ? {
      transform: 'translate3d(0, 0, 0)',
      opacity: 1
    } : {}, style
  );
  const inputClasses = classnames(css.input_wrapper, className);
  function renderLeftIcon() {
    if (leftIcon) {
      return <Column float="left">{leftIcon}</Column>;
    }
    return null;
  }
  function renderMsgIcon() {
    if (msgIcon) {
      return msgIcon;
    }
    return null;
  }
  function renderMsg() {
    return (
      <p style={msgWrapperStyles} className={msgWrapperClasses}>
        {renderMsgIcon()} <span className={css.input_msg_content}>{inputMsg}</span>
      </p>
    );
  }
  return (
    <Column className={css.input_container} width={width}>
      <Row>
        <Row style={style} className={inputClasses}>
          {renderLeftIcon()}
          <input
            max={max}
            name={name}
            type={type}
            placeholder={placeholder}
            onClick={onClick}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            className={css.input}
          />
        </Row>
        {renderMsg()}
      </Row>
    </Column>
  );
}

Input.propTypes = {
  icon: PropTypes.element
};
