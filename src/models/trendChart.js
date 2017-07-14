import * as service from '../services/trendChart';

export default {
  namespace: 'trend',
  state: {
    resultsData: {}
  },
  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },
  effects: {
    *getHistoryList({ payload }, { call, put }) {
      const { data } = yield call(service.resultsRecord, payload);
      const { gameUniqueId } = payload;
      yield put({ type: 'save', payload: { resultsData: data, ...{ gameUniqueId } } });
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname, query }) => {
        if (pathname === '/trend' || pathname === 'trend') {
          dispatch({ type: 'getHistoryList', payload: query });
        }
        if (pathname.indexOf('trendpage') > -1) {
          dispatch({ type: 'gameInfosModel/getHomepageInfo' });
        }
      });
    }
  },  
};
