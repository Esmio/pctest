import React, { Component } from 'react';
import { connect } from 'dva';
import { MDIcon } from '../General/';
import css from '../../styles/header/marquee.less';


class Marquee extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  renderMarquee() {
    let { announcements } = this.props;
    let announcementsText = _.map(announcements, item => `${item.createTime}: ${item.content}`);
    announcementsText = _.join(announcementsText, '; ');
    let annoucementsLength = announcementsText.length;
    annoucementsLength /= 2;
    announcements = _.map(announcements, (item, index) => {
      return (
        <span key={index}>{item.createTime}: {item.content}</span>
      ); 
    });
    const style = {
      animationDuration: `${annoucementsLength}s`
    };
    if (announcements) {
      return (
        <div className={css.marquee}>
          <div
            className={css.marquee_body}
          >
            <p className={css.marquee_content} style={style}>{announcements}</p>
          </div>
        </div>
      );
    }
    return null;
  }
  render() {
    return (
      <div className={css.marquee_row}>
        <MDIcon iconName="volume-high" className={css.marquee_icon} /> 
        { this.renderMarquee() }
        <div>
          <p className={css.marquee_Cs}>
            <span>客服电话：</span>
            <span>400-6666-1911</span>
          </p>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = ({ gameInfosModel }) => {
  const { announcement, announcements } = gameInfosModel;
  return { announcement, announcements };
};

export default connect(mapStatesToProps)(Marquee);
