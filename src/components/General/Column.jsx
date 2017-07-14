import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { strPropCheck, newStyle } from '../../utils/';
import css from '../../styles/general/layout.less';

export const Column = ({
  className,
  width,
  float,
  onClick,
  children,
  style
}) => {
  const columnClasses = classnames(css.column, className);
  const columnStyles = newStyle(
    { width, float }, style);
  return (
    <div
      className={columnClasses}
      style={columnStyles}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Column.propTypes = {
  style: PropTypes.object,
  child: PropTypes.element,
  width: (props, propName, componentName) => {
    const reg = /((px)|(rem)|(em)|(%)|(auto))/;
    const expectList = ['px', 'rem', 'em', 'or %'];
    return strPropCheck({ props, propName, componentName }, { reg, expectList });
  },
  float: (props, propName, componentName) => {
    const reg = /((left)|(right)|(none))/;
    const expectList = ['left', 'right', 'or none'];
    return strPropCheck({ props, propName, componentName }, { reg, expectList }, true);
  }
};

Column.defaultProps = {
  width: 'auto',
  float: 'left'
};
