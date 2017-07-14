import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import css from '../../styles/homepage/QRpanel.less';
import { MDIcon } from '../General';
import mobileDevice from '../../assets/image/mobile_device.png';

class QRPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showIphoneQR: true,
    };
    this.dispatch = this.props.dispatch.bind(this);
  }
  toggleQR(qrDisplay) {
   this.dispatch({ type: 'layoutModel/updateState', payload: { qrDisplay } });
  }
  renderIcon(iconName) {
    return <MDIcon className={css.QRPanel_btnIcon} iconName={iconName} />;
  }
  renderQR() {
    const { qrDisplay } = this.props;
    return (
      <QRCode value={this.props[`${qrDisplay}AppLink`]} size={100} />
    );
  }
  render() {
    const { qrDisplay } = this.props;
    
    return (
      <div className={css.QRPanel}>
        <h3 className={css.QRPanel_header}>手机购彩，<br />轻轻松松变土豪！</h3>
        <div className={css.QRPanel_body}>
          <div className={css.QR_code}>
            <h3>扫我下载</h3>
            <div className={css.QR_codeBody}>
              { this.renderQR() }
            </div>
          </div>
          <div className={css.QRPanel_device}>
            <img src={mobileDevice} alt="app screen example" />
          </div>
        </div>
        <div className={css.QRPanel_buttons}>
          <button
            data-active={qrDisplay === 'ios'}
            className={css.QRPanel_toggleBtn}
            icon={this.renderIcon('apple')}
            onClick={this.toggleQR.bind(this, 'ios')}
          ><MDIcon iconName="apple" /><i>Iphone版</i></button>
          <button
            className={css.QRPanel_toggleBtn}
            data-active={qrDisplay === 'android'}
            icon={this.renderIcon('android')}
            onClick={this.toggleQR.bind(this, 'android')}
          ><MDIcon iconName="android" /><i>Android版</i></button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ layoutModel }) {
  const { qrDisplay, iosAppLink, androidAppLink } = layoutModel;
  return { qrDisplay, iosAppLink, androidAppLink };
}

export default connect(mapStateToProps)(QRPanel);
