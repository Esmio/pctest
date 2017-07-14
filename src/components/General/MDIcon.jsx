import React from 'react';
import classNames from 'classnames';
import css from '../../styles/general/icon.less';
import mdiStyles from '../../assets/bower_components/mdi/css/materialdesignicons.css';

function MDIcon({
  iconName,
  className,
  style,
  bubbleCount
}) {
  const classes = classNames(
    css.icon,
    `${mdiStyles.mdi}`,
    `${mdiStyles[`mdi-${iconName}`]}`,
    className
  );
  return (
    <i className={classes} style={style} data-count={bubbleCount} />
  );
}

export { MDIcon };
