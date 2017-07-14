import React, { Component } from 'react';
import { connect } from 'dva';
import Header from '../Header/Header';
import HomePageBody from './HomePageBody';


class HomeIndex extends Component {
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch.bind(this);
  }
  
  componentWillMount() {
    this.dispatch({ type: 'gameInfosModel/getAllHistory' });
    this.dispatch({ type: 'gameInfosModel/getHomepageInfo' });
    this.dispatch({ type: 'gameInfosModel/getAllGamesSetting' });
  }
  render() {
    return (
      <div>
      <Header />
      <HomePageBody />
    </div>
    );
  }
}

export default connect()(HomeIndex);
