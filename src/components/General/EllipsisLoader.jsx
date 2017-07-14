import React, { Component } from 'react';
import _ from 'lodash';
import css from '../../styles/general/loader.less';

class EllipsisLoader extends Component {
  constructor() {
    super();
    this.state = {
      dotCount: 0
    };
    this.interval = null;
		this.startInterval = this.startInterval.bind(this);
		this.dotting = this.dotting.bind(this);
  }
  componentWillMount() {
    this.startInterval();
  }
	componentWillUnmount() {
		clearInterval(this.interval);
	}
  startInterval() {
		let { duration } = this.props;
		duration = duration < 3000 ? 3000 : duration;
		duration = Math.round(duration / 6);
    clearInterval(this.interval);
    this.interval = setInterval(this.dotting, duration);
  }
  dotting() {
		const { dotCount } = this.state;
		if (dotCount >= 6) {
			this.setState({
				dotCount: 0
			});
		} else {
			this.setState({
				dotCount: dotCount + 1,
			});
		}
	}
  render() {
		const { dotCount } = this.state;
		
		return (
			<span>
				{
					_.map([0, 1, 2, 3, 4, 5, 6], (count) => {
						const className = count <= dotCount ? css.ellipsisLoader__active : css.ellipsisLoader;
						return <span key={count} className={className} />;
					})
				}
			</span>
		);
  }
}

export { EllipsisLoader };
