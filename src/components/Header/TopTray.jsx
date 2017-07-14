import React, { Component } from 'react';
import TopLinks from './TopLinks';
import Marquee from './Marquee';

import css from '../../styles/header/header.less';

class TopTray extends Component {
  render() {
    return (
      <div className={css.header_topTray}>
        <Marquee announcements={this.props.announcements} />
        {/*<TopLinks />*/}
      </div>
    );
  }
}
export default TopTray;
