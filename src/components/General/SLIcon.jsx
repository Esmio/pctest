import React from 'react';
import classnames from 'classnames';
import css from '../../styles/general/icon.less';
import libStyles from '../../assets/bower_components/simple-line-icons/css/simple-line-icons.css';


function SLIcon({
  iconName, style, className
}) {
  const classes = classnames(css.icon, libStyles[`icon-${iconName}`], className);
  return (
    <i className={classes} style={style} />
  );
}

SLIcon.defaultProps = {
  iconName: 'user'
};

export { SLIcon };
