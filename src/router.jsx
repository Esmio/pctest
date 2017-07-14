import React from 'react';
import moment from 'moment';
import { Router, Route } from 'dva/router';
import HomePage from './components/HomePage';
import BetCenter from './components/BetCenter';
import TrendChartIndex from './components/TrendChart/';
import TrendPage from './components/TrendPage/';
import SpecialOffer from './components/SpecialOffer';
import HelpList from './components/HelpList';
import History from './components/History';

moment.locale('zh-cn');

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={HomePage} />
      <Route path="/trend" component={TrendChartIndex} />
      <Route path="/trendpage" component={TrendPage} />
      <Route path="/specialoffer" component={SpecialOffer} />
      <Route path="/history" component={History} />
      <Route path="/betcenter" component={BetCenter} />
      <Route path="/helplist" component={HelpList} />
    </Router>
  );
}

export default RouterConfig;
