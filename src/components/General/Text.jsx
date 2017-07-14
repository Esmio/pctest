import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlaceLoader } from '../General';
import { newStyle, toLettercase, stripUnit } from '../../utils';
import lessVar from '../../styles/variables.less';

class Text extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loaded: false
    };
  }
  textShouldShow() {
    const { loaded, children } = this.props; 
    return loaded !== false && children && children !== '';
  }

  render() {
    const {
      children,
      width,
      style,
      className,
      size,
      textAlign,
      loaderDuration,
      loaderOffset,
      loaderBuffer
    } = this.props;
    const fontSize = lessVar[`size${size}`];
    const lineHeight = `${stripUnit(fontSize) * 1.4}`;
    const textStyles = newStyle({
      textAlign,
      fontSize
    }, style);
    const containerStyle = newStyle({
      position: 'relative',
      textAlign,
      width: this.textShouldShow() ? 'auto' : width,
      padding: `${(lineHeight - stripUnit(fontSize)) / 2}rem 0`,
    });
    const alignment = toLettercase.call(textAlign);
    const loaderStyle = newStyle(
      { marginRight: 'auto', marginLeft: 'auto' },
      { [`margin${alignment}`]: 0 }
    );
    if (this.textShouldShow()) {
      return (
        <p 
          style={textStyles} 
          className={className}
        >
          { children }
        </p>
      );
    }
    return (
      <div style={containerStyle} className={className}>
        <PlaceLoader
          style={loaderStyle}
          width={`${stripUnit(fontSize) * 5}rem`}
          height={fontSize}
          loaderDuration={loaderDuration}
          loaderOffset={loaderOffset}
          loaderBuffer={loaderBuffer}
        />
      </div>
    );
  }
}

Text.defaultProps = {
  width: 'auto',
  size: 3,
  textAlign: 'left'
};

Text.propTypes = {
  loaded: PropTypes.bool,
  size: PropTypes.number
};

export { Text };
