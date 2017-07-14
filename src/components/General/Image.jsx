import React, { Component } from 'react';
import classnames from 'classnames';
import { MDIcon, PlaceLoader } from '../General';
import css from '../../styles/general/image.less'; 
import { newStyle } from '../../utils';

class Image extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      imgIsLoading: true,
      imgOnError: false,
      loadedImg: ''
    };
  }
  onImgLoaded(loadedImg) {
    this.setState({
      loadedImg,
      imgOnError: false,
      imgIsLoading: false
    });
    this.onLoadHandler();
  }
  onLoadHandler() {
    const { onLoad } = this.props;
    if (onLoad) { onLoad(); } 
  }
  onImgError() {
    this.setState({
      loadedImg: '',
      imgOnError: true,
      imgIsLoading: false
    });
    this.onLoadHandler();
  }
  renderAltText() {
    const { imgOnError } = this.state;
    const { imgAlt } = this.props;
    
    if (imgOnError) {
      return (
        <p className={css.img_alt_wrapper} >
          <MDIcon iconName="image-broken" className={css.img_alt_icon} />
          <span className={css.img_alt}> {imgAlt}</span>
        </p>
      );
    }
    return null;
  }
  renderImg() {
    const {
      imgUrl
    } = this.props;
    const { loadedImg } = this.state;
    const imgBg = {
      backgroundImage: `url('${loadedImg}')`
    };
    
    return (
      <div style={imgBg} className={css.img_wrapper}>
        <img
          className={css.image}
          alt=""
          src={imgUrl}
          onLoad={this.onImgLoaded.bind(this, imgUrl)}
          onError={this.onImgError.bind(this)}
        />
      </div>
    );
  }
  renderLoader() {
    const { imgIsLoading } = this.state;
    const { loaderDuration, loaderOffset, loaderBuffer } = this.props;
    if (imgIsLoading) {
      return (
        <PlaceLoader
          className={css.img_loader}
          height="100%"
          width="100%"
          loaderDuration={loaderDuration}
          loaderOffset={loaderOffset}
          loaderBuffer={loaderBuffer}
        />
      );
    }
    return null;
  }
  render() {
    const { imgOnError } = this.state;
    const { height, width, borderRadius, style, className } = this.props;
    const imgContainterClasses = classnames(
      imgOnError ? css.img_container__error : css.img_container,
      className
    );
    const containerStyles = newStyle({ height, width, borderRadius }, style);
    return (
      <div style={containerStyles} className={imgContainterClasses}>
        { this.renderAltText() }
        { this.renderImg() }
        { this.renderLoader() }
      </div>
    );
  }
}

Image.defaultProps = {
  height: '2.25rem',
  width: '2.25rem',
  imgUrl: '#'
};

export { Image };
