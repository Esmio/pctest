import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import css from '../../styles/general/loader.less';
import { newStyle } from '../../utils';
import lessVar from '../../styles/variables.less';

export class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      animationName: ''
    };
  }

  componentWillMount() {
    const { color } = this.props;
    this.setState({
      color: color.slice(1, color.length)
    });
  }

  componentDidMount() {
    this.createKeyFrame();
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps !== this.props ||
      nextState.animationName !== this.props.animationName
    ) {
      return true;
    }
    return false;
  }
  componentWillUnmount() {
    this.removeKeyFrame();
  }
  
  removeKeyFrame() {
    const { animationName, toDeleteRule } = this.state;
    const styleSheet = document.styleSheets[0];
    for (let i = 0; i < toDeleteRule; i++) {
      const animLoaderIndex = _.findLast(
        styleSheet.cssRules, (cssRule) => cssRule.name === `${animationName}Loader`
      );
      const animRoundIndex = _.findLast(
        styleSheet.cssRules, (cssRule) => cssRule.name === `${animationName}Round`
      );
      styleSheet.deleteRule(animLoaderIndex);
      styleSheet.deleteRule(animRoundIndex);
    }
  }
  createKeyFrame() {
    const { color } = this.state;
    const styleSheet = document.styleSheets[0];
    const animationName = `animDefault${color}`;
    const keyframes = [`@-webkit-keyframes ${animationName}Loader {
      0% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        0 -0.83em 0 -0.42em #${color},
        0 -0.83em 0 -0.44em #${color},
        0 -0.83em 0 -0.46em #${color},
        0 -0.83em 0 -0.477em #${color};
      }
      5%, 95% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        0 -0.83em 0 -0.42em #${color},
        0 -0.83em 0 -0.44em #${color},
        0 -0.83em 0 -0.46em #${color},
        0 -0.83em 0 -0.477em #${color};
      }
      10%, 59% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        -0.087em -0.825em 0 -0.42em #${color},
        -0.173em -0.812em 0 -0.44em #${color},
        -0.256em -0.789em 0 -0.46em #${color},
        -0.297em -0.775em 0 -0.477em #${color};
      }
      20% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        -0.338em -0.758em 0 -0.42em #${color},
        -0.555em -0.617em 0 -0.44em #${color},
        -0.671em -0.488em 0 -0.46em #${color},
        -0.749em -0.34em 0 -0.477em #${color};
      }
      38% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        -0.377em -0.74em 0 -0.42em #${color},
        -0.645em -0.522em 0 -0.44em #${color},
        -0.775em -0.297em 0 -0.46em #${color},
        -0.82em -0.09em 0 -0.477em #${color};
      }
      100% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        0 -0.83em 0 -0.42em #${color},
        0 -0.83em 0 -0.44em #${color},
        0 -0.83em 0 -0.46em #${color},
        0 -0.83em 0 -0.477em #${color};
      }
    }`, `@keyframes ${animationName}Loader {
      0% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        0 -0.83em 0 -0.42em #${color},
        0 -0.83em 0 -0.44em #${color},
        0 -0.83em 0 -0.46em #${color},
        0 -0.83em 0 -0.477em #${color};
      }
      5%, 95% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        0 -0.83em 0 -0.42em #${color},
        0 -0.83em 0 -0.44em #${color},
        0 -0.83em 0 -0.46em #${color},
        0 -0.83em 0 -0.477em #${color};
      }
      10%, 59% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        -0.087em -0.825em 0 -0.42em #${color},
        -0.173em -0.812em 0 -0.44em #${color},
        -0.256em -0.789em 0 -0.46em #${color},
        -0.297em -0.775em 0 -0.477em #${color};
      }
      20% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        -0.338em -0.758em 0 -0.42em #${color},
        -0.555em -0.617em 0 -0.44em #${color},
        -0.671em -0.488em 0 -0.46em #${color},
        -0.749em -0.34em 0 -0.477em #${color};
      }
      38% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        -0.377em -0.74em 0 -0.42em #${color},
        -0.645em -0.522em 0 -0.44em #${color},
        -0.775em -0.297em 0 -0.46em #${color},
        -0.82em -0.09em 0 -0.477em #${color};
      }
      100% {
        box-shadow: 0 -0.83em 0 -0.4em #${color},
        0 -0.83em 0 -0.42em #${color},
        0 -0.83em 0 -0.44em #${color},
        0 -0.83em 0 -0.46em #${color},
        0 -0.83em 0 -0.477em #${color};
      }
    }`, `@-webkit-keyframes ${animationName}Round {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }`, `@keyframes ${animationName}Round {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }`];

    const applyKeyframes = () => {
      keyframes.forEach((keyframe) => {
        // console.debug(styleSheet.cssRules.length);
        return styleSheet.insertRule(keyframe, styleSheet.cssRules.length);
      });
    };

    applyKeyframes();
    // console.debug('cssRulesIndex', styleSheet.cssRules.length - 1);
    this.setState({ 
      animationName,
      toDeleteRule: 2
    });
  }

  render() {
    const { size, className, style } = this.props;
    const { animationName } = this.state;
    const classes = classnames(css.loader, className);
    const animation = {
      fontSize: size,
      WebkitAnimation:
        `${animationName}Loader 1.7s infinite ease,
        ${animationName}Round 1.7s infinite ease`,
      animation:
        `${animationName}Loader 1.7s infinite ease,
        ${animationName}Round 1.7s infinite ease`
    };
    const loaderStyles = newStyle(style, animation);

    return (
      <div style={loaderStyles} className={classes}>Loading...</div>
    );
  }
}

Loader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string
};

Loader.defaultProps = {
  color: lessVar.accentCinnabar,
  size: lessVar.size4
};
