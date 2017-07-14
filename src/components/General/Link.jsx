import React, { Component } from 'react';
import lessVar from '../../styles/variables.less';
import { newStyle } from '../../utils';

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }
  mouseEnterHandler() {
    const { onMouseEnter } = this.props;
    this.setState({ hover: true });
    if (onMouseEnter) {
      onMouseEnter();
    }
  }
  mouseLeaveHandler() {
    const { onMouseLeave } = this.props;
    this.setState({ hover: false });
    if (onMouseLeave) {
      onMouseLeave();
    }
  }
  render() {
    const { children, style, href, onClick, className } = this.props;
    const { hover } = this.state;
    const linkStyles = newStyle(style, hover ? {
      color: lessVar.cinnabar
    } : {});
    return (
      <a
        className={className}
        style={linkStyles}
        href={href}
        onClick={onClick}
        onMouseEnter={
          this.mouseEnterHandler.bind(this)
        }
        onMouseLeave={
          this.mouseLeaveHandler.bind(this)
        }
      >
        { children }
      </a>
    );
  }
}

export { Link };
